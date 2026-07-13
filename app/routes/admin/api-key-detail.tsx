import { useState } from "react";
import { Link, useNavigate, useRevalidator } from "react-router";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { Badge } from "~/components/ui/badge";
import { ScrollArea } from "~/components/ui/scroll-area";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "~/components/ui/dialog";
import {
    ArrowLeft,
    KeyRound,
    Activity,
    Coins,
    Globe2,
    Ban,
    Check,
    Trash2,
    Loader2,
    ShieldCheck,
} from "lucide-react";
import { prisma } from "~/lib/db.server";
import { toast } from "sonner";

interface AssistantOption {
    id: string;
    name: string;
}
interface DayPoint {
    label: string;
    calls: number;
    tokens: number;
}
interface Bar {
    label: string;
    value: number;
}
interface RecentRow {
    id: string;
    createdAt: string | Date;
    ip: string | null;
    status: number;
    totalTokens: number;
    agentName: string;
}
interface KeyInfo {
    id: string;
    name: string | null;
    keyPrefix: string;
    revoked: boolean;
    lastUsedAt: string | Date | null;
    createdAt: string | Date;
    assistants: AssistantOption[];
}
interface LoaderData {
    keyInfo: KeyInfo;
    assistants: AssistantOption[];
    totals: { calls: number; tokens: number; uniqueIps: number };
    days: DayPoint[];
    byAgent: Bar[];
    byIp: Bar[];
    recent: RecentRow[];
}

export async function loader({
    params,
}: {
    params: { keyId: string };
}): Promise<Response | LoaderData> {
    const keyId = params.keyId;

    const keyInfo = await prisma.apiKey.findUnique({
        where: { id: keyId },
        select: {
            id: true,
            name: true,
            keyPrefix: true,
            revoked: true,
            lastUsedAt: true,
            createdAt: true,
            assistants: { select: { id: true, name: true }, orderBy: { name: "asc" } },
        },
    });

    if (!keyInfo) {
        return new Response(null, { status: 302, headers: { Location: "/admin/api-keys" } });
    }

    const since = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);

    const [agg, rows, recentRaw, assistants] = await Promise.all([
        prisma.apiKeyUsage.aggregate({
            where: { apiKeyId: keyId },
            _count: { _all: true },
            _sum: { totalTokens: true },
        }),
        prisma.apiKeyUsage.findMany({
            where: { apiKeyId: keyId, createdAt: { gte: since } },
            select: { createdAt: true, ip: true, status: true, totalTokens: true, assistantId: true },
            take: 5000,
        }),
        prisma.apiKeyUsage.findMany({
            where: { apiKeyId: keyId },
            orderBy: { createdAt: "desc" },
            take: 20,
            select: { id: true, createdAt: true, ip: true, status: true, totalTokens: true, assistantId: true },
        }),
        prisma.assistant.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }),
    ]);

    const nameById = new Map(assistants.map((a) => [a.id, a.name]));

    // Last 14 days buckets
    const dayKeys: string[] = [];
    const dayMap = new Map<string, DayPoint>();
    for (let i = 13; i >= 0; i--) {
        const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
        const key = d.toISOString().slice(0, 10);
        const label = `${String(d.getDate()).padStart(2, "0")}.${String(d.getMonth() + 1).padStart(2, "0")}`;
        dayKeys.push(key);
        dayMap.set(key, { label, calls: 0, tokens: 0 });
    }

    const agentCounts = new Map<string, number>();
    const ipCounts = new Map<string, number>();

    for (const r of rows) {
        const key = new Date(r.createdAt).toISOString().slice(0, 10);
        const bucket = dayMap.get(key);
        if (bucket) {
            bucket.calls += 1;
            bucket.tokens += r.totalTokens;
        }
        const an = r.assistantId ? nameById.get(r.assistantId) ?? r.assistantId : "—";
        agentCounts.set(an, (agentCounts.get(an) ?? 0) + 1);
        const ip = r.ip || "bilinmiyor";
        ipCounts.set(ip, (ipCounts.get(ip) ?? 0) + 1);
    }

    const byAgent: Bar[] = [...agentCounts.entries()]
        .map(([label, value]) => ({ label, value }))
        .sort((a, b) => b.value - a.value);
    const byIp: Bar[] = [...ipCounts.entries()]
        .map(([label, value]) => ({ label, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 8);

    const recent: RecentRow[] = recentRaw.map((r) => ({
        id: r.id,
        createdAt: r.createdAt,
        ip: r.ip,
        status: r.status,
        totalTokens: r.totalTokens,
        agentName: r.assistantId ? nameById.get(r.assistantId) ?? r.assistantId : "—",
    }));

    return {
        keyInfo,
        assistants,
        totals: {
            calls: agg._count._all,
            tokens: agg._sum.totalTokens ?? 0,
            uniqueIps: ipCounts.size,
        },
        days: dayKeys.map((k) => dayMap.get(k)!),
        byAgent,
        byIp,
        recent,
    };
}

function formatDate(d: string | Date | null): string {
    if (!d) return "—";
    return new Date(d).toLocaleString("tr-TR", { dateStyle: "short", timeStyle: "short" });
}

function statusClass(status: number): string {
    if (status >= 500) return "bg-red-500/15 text-red-400";
    if (status >= 400) return "bg-amber-500/15 text-amber-400";
    return "bg-emerald-500/15 text-emerald-400";
}

export default function ApiKeyDetail({ loaderData }: { loaderData: LoaderData }) {
    const { keyInfo, assistants, totals, days, byAgent, byIp, recent } = loaderData;
    const navigate = useNavigate();
    const revalidator = useRevalidator();

    const [busy, setBusy] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [selected, setSelected] = useState<string[]>(keyInfo.assistants.map((a) => a.id));
    const [savingEdit, setSavingEdit] = useState(false);

    const patch = async (body: object, okMsg: string) => {
        setBusy(true);
        try {
            const res = await fetch(`/api/admin/api-keys/${keyInfo.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });
            if (res.ok) {
                toast.success(okMsg);
                revalidator.revalidate();
                return true;
            }
            toast.error("İşlem başarısız");
            return false;
        } finally {
            setBusy(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm("Bu anahtarı silmek istediğinize emin misiniz?")) return;
        setBusy(true);
        const res = await fetch(`/api/admin/api-keys/${keyInfo.id}`, { method: "DELETE" });
        if (res.ok) {
            toast.success("Anahtar silindi");
            navigate("/admin/api-keys");
        } else {
            toast.error("Silinemedi");
            setBusy(false);
        }
    };

    const handleSaveEdit = async () => {
        if (selected.length === 0) {
            toast.error("En az bir asistan seçin");
            return;
        }
        setSavingEdit(true);
        const ok = await patch({ assistantIds: selected }, "İzinler güncellendi");
        setSavingEdit(false);
        if (ok) setEditOpen(false);
    };

    const maxCalls = Math.max(1, ...days.map((d) => d.calls));
    const maxTokens = Math.max(1, ...days.map((d) => d.tokens));
    const maxAgent = Math.max(1, ...byAgent.map((b) => b.value));
    const maxIp = Math.max(1, ...byIp.map((b) => b.value));

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Link to="/admin/api-keys">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <div>
                        <div className="flex items-center gap-2">
                            <KeyRound className="h-5 w-5 text-[#21c6cc]" />
                            <h1 className="text-2xl font-bold">{keyInfo.name || "İsimsiz anahtar"}</h1>
                            {keyInfo.revoked ? (
                                <Badge variant="destructive">İptal edildi</Badge>
                            ) : (
                                <Badge variant="default">Aktif</Badge>
                            )}
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">
                            <code className="rounded bg-muted px-1 py-0.5 text-xs">{keyInfo.keyPrefix}…</code>{" "}
                            · Oluşturuldu {formatDate(keyInfo.createdAt)} · Son kullanım{" "}
                            {formatDate(keyInfo.lastUsedAt)}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => setEditOpen(true)}>
                        İzinleri düzenle
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={busy}
                        onClick={() =>
                            patch(
                                { revoked: !keyInfo.revoked },
                                keyInfo.revoked ? "Anahtar etkinleştirildi" : "Anahtar pasifleştirildi",
                            )
                        }
                        className="gap-1.5"
                    >
                        {busy ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : keyInfo.revoked ? (
                            <Check className="h-4 w-4" />
                        ) : (
                            <Ban className="h-4 w-4" />
                        )}
                        {keyInfo.revoked ? "Etkinleştir" : "Pasifize et"}
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        disabled={busy}
                        onClick={handleDelete}
                        className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Permitted agents */}
            <div className="flex flex-wrap items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">İzinli asistanlar:</span>
                {keyInfo.assistants.length > 0 ? (
                    keyInfo.assistants.map((a) => (
                        <Badge key={a.id} variant="secondary" className="text-xs">
                            {a.name}
                        </Badge>
                    ))
                ) : (
                    <span className="text-xs text-muted-foreground">İzin yok</span>
                )}
            </div>

            {/* Stat tiles */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <StatTile icon={<Activity className="h-5 w-5" />} label="Toplam Çağrı" value={totals.calls.toLocaleString("tr-TR")} tint="#21c6cc" />
                <StatTile icon={<Coins className="h-5 w-5" />} label="Toplam Token" value={totals.tokens.toLocaleString("tr-TR")} tint="#8d36ff" />
                <StatTile icon={<Globe2 className="h-5 w-5" />} label="Benzersiz IP (14g)" value={totals.uniqueIps.toLocaleString("tr-TR")} tint="#d84fd2" />
            </div>

            {/* Time-series charts */}
            <div className="grid gap-6 lg:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Son 14 Gün — Çağrı Sayısı</CardTitle>
                        <CardDescription>Günlük istek adedi</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <VBars data={days.map((d) => ({ label: d.label, value: d.calls }))} max={maxCalls} color="#21c6cc" />
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Son 14 Gün — Token Kullanımı</CardTitle>
                        <CardDescription>Günlük toplam token</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <VBars data={days.map((d) => ({ label: d.label, value: d.tokens }))} max={maxTokens} color="#8d36ff" />
                    </CardContent>
                </Card>
            </div>

            {/* Breakdown charts */}
            <div className="grid gap-6 lg:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Asistana Göre Çağrı (14g)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {byAgent.length ? (
                            <HBars data={byAgent} max={maxAgent} color="#21c6cc" />
                        ) : (
                            <Empty />
                        )}
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">IP'ye Göre Çağrı (14g)</CardTitle>
                        <CardDescription>Nereden bağlanıldı</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {byIp.length ? <HBars data={byIp} max={maxIp} color="#d84fd2" /> : <Empty />}
                    </CardContent>
                </Card>
            </div>

            {/* Recent requests */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Son İstekler</CardTitle>
                    <CardDescription>En son 20 çağrı</CardDescription>
                </CardHeader>
                <CardContent>
                    {recent.length ? (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="text-muted-foreground">
                                    <tr className="border-b">
                                        <th className="py-2 pr-4 font-medium">Zaman</th>
                                        <th className="py-2 pr-4 font-medium">IP</th>
                                        <th className="py-2 pr-4 font-medium">Asistan</th>
                                        <th className="py-2 pr-4 font-medium">Durum</th>
                                        <th className="py-2 font-medium text-right">Token</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recent.map((r) => (
                                        <tr key={r.id} className="border-b border-border/50">
                                            <td className="py-2 pr-4 whitespace-nowrap">{formatDate(r.createdAt)}</td>
                                            <td className="py-2 pr-4 font-mono text-xs">{r.ip || "—"}</td>
                                            <td className="py-2 pr-4">{r.agentName}</td>
                                            <td className="py-2 pr-4">
                                                <span className={`rounded px-1.5 py-0.5 text-xs font-medium ${statusClass(r.status)}`}>
                                                    {r.status}
                                                </span>
                                            </td>
                                            <td className="py-2 text-right tabular-nums">{r.totalTokens.toLocaleString("tr-TR")}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <Empty />
                    )}
                </CardContent>
            </Card>

            {/* Edit permissions dialog */}
            <Dialog open={editOpen} onOpenChange={setEditOpen}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>İzinleri düzenle</DialogTitle>
                    </DialogHeader>
                    <div className="mt-4 space-y-2">
                        <Label>İzinli Asistanlar</Label>
                        <ScrollArea className="h-[240px] rounded-lg border">
                            <div className="space-y-1 p-2">
                                {assistants.map((a) => {
                                    const on = selected.includes(a.id);
                                    return (
                                        <button
                                            key={a.id}
                                            type="button"
                                            onClick={() =>
                                                setSelected(on ? selected.filter((x) => x !== a.id) : [...selected, a.id])
                                            }
                                            className={`flex w-full items-center gap-3 rounded-lg p-2 text-left transition-colors ${
                                                on ? "border border-[#21c6cc]/30 bg-[#21c6cc]/10" : "border border-transparent hover:bg-muted"
                                            }`}
                                        >
                                            <span
                                                className={`flex h-5 w-5 items-center justify-center rounded border ${
                                                    on ? "border-[#21c6cc] bg-[#21c6cc] text-white" : "border-muted-foreground/40"
                                                }`}
                                            >
                                                {on && <Check className="h-3.5 w-3.5" />}
                                            </span>
                                            <span className="truncate">{a.name}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </ScrollArea>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setEditOpen(false)}>
                            İptal
                        </Button>
                        <Button onClick={handleSaveEdit} disabled={savingEdit} className="gap-2">
                            {savingEdit && <Loader2 className="h-4 w-4 animate-spin" />}
                            Kaydet
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

function StatTile({ icon, label, value, tint }: { icon: React.ReactNode; label: string; value: string; tint: string }) {
    return (
        <Card>
            <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                    <div
                        className="flex h-10 w-10 items-center justify-center rounded-lg"
                        style={{ backgroundColor: tint + "1a", color: tint }}
                    >
                        {icon}
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">{label}</p>
                        <p className="text-2xl font-bold tabular-nums">{value}</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

function Empty() {
    return <p className="py-8 text-center text-sm text-muted-foreground">Henüz veri yok</p>;
}

// Vertical bars (time series).
function VBars({ data, max, color }: { data: Bar[]; max: number; color: string }) {
    return (
        <div className="flex h-40 items-end gap-1">
            {data.map((d, i) => (
                <div key={i} className="flex flex-1 flex-col items-center gap-1" title={`${d.label}: ${d.value}`}>
                    <div
                        className="w-full rounded-t transition-all"
                        style={{
                            height: `${Math.max(2, (d.value / max) * 100)}%`,
                            backgroundColor: d.value > 0 ? color : "var(--border)",
                            opacity: d.value > 0 ? 1 : 0.4,
                        }}
                    />
                    <span className="text-[9px] text-muted-foreground">{d.label}</span>
                </div>
            ))}
        </div>
    );
}

// Horizontal bars (breakdowns).
function HBars({ data, max, color }: { data: Bar[]; max: number; color: string }) {
    return (
        <div className="space-y-2">
            {data.map((d, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                    <span className="w-28 shrink-0 truncate text-muted-foreground" title={d.label}>
                        {d.label}
                    </span>
                    <div className="h-4 flex-1 overflow-hidden rounded bg-muted">
                        <div
                            className="h-full rounded"
                            style={{ width: `${Math.max(3, (d.value / max) * 100)}%`, backgroundColor: color }}
                        />
                    </div>
                    <span className="w-10 shrink-0 text-right tabular-nums">{d.value}</span>
                </div>
            ))}
        </div>
    );
}
