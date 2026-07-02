import { useState } from "react";
import { Link, useRevalidator } from "react-router";
import { Card, CardContent } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Badge } from "~/components/ui/badge";
import { ScrollArea } from "~/components/ui/scroll-area";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "~/components/ui/dialog";
import {
    KeyRound,
    Plus,
    Loader2,
    Copy,
    Trash2,
    Ban,
    Check,
    ShieldCheck,
} from "lucide-react";
import { prisma } from "~/lib/db.server";
import { toast } from "sonner";

interface AssistantOption {
    id: string;
    name: string;
}

interface ApiKeyData {
    id: string;
    name: string | null;
    keyPrefix: string;
    revoked: boolean;
    lastUsedAt: string | Date | null;
    createdAt: string | Date;
    assistants: AssistantOption[];
}

interface LoaderData {
    keys: ApiKeyData[];
    assistants: AssistantOption[];
}

export async function loader(): Promise<LoaderData> {
    const [keys, assistants] = await Promise.all([
        prisma.apiKey.findMany({
            select: {
                id: true,
                name: true,
                keyPrefix: true,
                revoked: true,
                lastUsedAt: true,
                createdAt: true,
                assistants: { select: { id: true, name: true }, orderBy: { name: "asc" } },
            },
            orderBy: { createdAt: "desc" },
        }),
        prisma.assistant.findMany({
            select: { id: true, name: true },
            orderBy: { name: "asc" },
        }),
    ]);
    return { keys, assistants };
}

interface ComponentProps {
    loaderData: LoaderData;
}

function formatDate(d: string | Date | null): string {
    if (!d) return "—";
    return new Date(d).toLocaleString("tr-TR", { dateStyle: "medium", timeStyle: "short" });
}

export default function AdminApiKeys({ loaderData }: ComponentProps) {
    const { keys, assistants } = loaderData;
    const revalidator = useRevalidator();

    // Create dialog
    const [createOpen, setCreateOpen] = useState(false);
    const [name, setName] = useState("");
    const [selected, setSelected] = useState<string[]>([]);
    const [isCreating, setIsCreating] = useState(false);

    // Reveal-once dialog for the freshly created raw key
    const [rawKey, setRawKey] = useState<string | null>(null);

    // Edit-permissions dialog
    const [editKey, setEditKey] = useState<ApiKeyData | null>(null);
    const [editSelected, setEditSelected] = useState<string[]>([]);
    const [isSavingEdit, setIsSavingEdit] = useState(false);

    // Per-row busy states
    const [busyId, setBusyId] = useState<string | null>(null);

    const toggle = (list: string[], setList: (v: string[]) => void, id: string) =>
        setList(list.includes(id) ? list.filter((x) => x !== id) : [...list, id]);

    const copy = (text: string) =>
        navigator.clipboard.writeText(text).then(
            () => toast.success("Kopyalandı"),
            () => toast.error("Kopyalanamadı"),
        );

    const handleCreate = async () => {
        if (selected.length === 0) {
            toast.error("En az bir asistan seçin");
            return;
        }
        setIsCreating(true);
        try {
            const res = await fetch("/api/admin/api-keys", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, assistantIds: selected }),
            });
            const data = await res.json().catch(() => null);
            if (res.ok && data?.rawKey) {
                setCreateOpen(false);
                setName("");
                setSelected([]);
                setRawKey(data.rawKey);
                revalidator.revalidate();
            } else {
                toast.error(data?.error || "Anahtar oluşturulamadı");
            }
        } finally {
            setIsCreating(false);
        }
    };

    const patchKey = async (id: string, body: object, okMsg: string) => {
        setBusyId(id);
        try {
            const res = await fetch(`/api/admin/api-keys/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });
            if (res.ok) {
                toast.success(okMsg);
                revalidator.revalidate();
                return true;
            }
            const data = await res.json().catch(() => null);
            toast.error(data?.error || "İşlem başarısız");
            return false;
        } finally {
            setBusyId(null);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Bu anahtarı silmek istediğinize emin misiniz?")) return;
        setBusyId(id);
        try {
            const res = await fetch(`/api/admin/api-keys/${id}`, { method: "DELETE" });
            if (res.ok) {
                toast.success("Anahtar silindi");
                revalidator.revalidate();
            } else {
                toast.error("Silinemedi");
            }
        } finally {
            setBusyId(null);
        }
    };

    const openEdit = (key: ApiKeyData) => {
        setEditKey(key);
        setEditSelected(key.assistants.map((a) => a.id));
    };

    const handleSaveEdit = async () => {
        if (!editKey) return;
        if (editSelected.length === 0) {
            toast.error("En az bir asistan seçin");
            return;
        }
        setIsSavingEdit(true);
        const ok = await patchKey(editKey.id, { assistantIds: editSelected }, "İzinler güncellendi");
        setIsSavingEdit(false);
        if (ok) setEditKey(null);
    };

    const AssistantChecklist = ({
        value,
        onToggle,
    }: {
        value: string[];
        onToggle: (id: string) => void;
    }) => (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <Label>İzinli Asistanlar</Label>
                <button
                    type="button"
                    className="text-xs text-[#21c6cc] hover:underline"
                    onClick={() =>
                        value.length === assistants.length
                            ? assistants.forEach((a) => value.includes(a.id) && onToggle(a.id))
                            : assistants.forEach((a) => !value.includes(a.id) && onToggle(a.id))
                    }
                >
                    {value.length === assistants.length ? "Temizle" : "Tümünü seç"}
                </button>
            </div>
            {assistants.length > 0 ? (
                <ScrollArea className="h-[200px] rounded-lg border">
                    <div className="p-2 space-y-1">
                        {assistants.map((a) => (
                            <button
                                key={a.id}
                                type="button"
                                onClick={() => onToggle(a.id)}
                                className={`flex w-full items-center gap-3 rounded-lg p-2 text-left transition-colors ${
                                    value.includes(a.id)
                                        ? "bg-[#21c6cc]/10 border border-[#21c6cc]/30"
                                        : "hover:bg-muted border border-transparent"
                                }`}
                            >
                                <span
                                    className={`flex h-5 w-5 items-center justify-center rounded border ${
                                        value.includes(a.id)
                                            ? "bg-[#21c6cc] border-[#21c6cc] text-white"
                                            : "border-muted-foreground/40"
                                    }`}
                                >
                                    {value.includes(a.id) && <Check className="h-3.5 w-3.5" />}
                                </span>
                                <span className="truncate">{a.name}</span>
                            </button>
                        ))}
                    </div>
                </ScrollArea>
            ) : (
                <p className="text-sm text-muted-foreground">Önce bir asistan oluşturun.</p>
            )}
        </div>
    );

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">API Anahtarları</h1>
                    <p className="mt-1 text-muted-foreground">
                        Agent API için anahtar üretin ve hangi asistanlara erişebileceğini seçin.
                    </p>
                </div>

                <Dialog open={createOpen} onOpenChange={setCreateOpen}>
                    <DialogTrigger asChild>
                        <Button className="gap-2 bg-gradient-to-r from-[#8d36ff] via-[#d84fd2] to-[#21c6cc] hover:brightness-110">
                            <Plus className="h-4 w-4" />
                            Yeni Anahtar
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-lg">
                        <DialogHeader>
                            <DialogTitle>Yeni API Anahtarı</DialogTitle>
                        </DialogHeader>
                        <div className="mt-4 space-y-4">
                            <div className="space-y-2">
                                <Label>Ad (opsiyonel)</Label>
                                <Input
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Orn: prod-entegrasyon"
                                />
                            </div>
                            <AssistantChecklist
                                value={selected}
                                onToggle={(id) => toggle(selected, setSelected, id)}
                            />
                            <Button
                                onClick={handleCreate}
                                disabled={isCreating || selected.length === 0}
                                className="w-full gap-2 bg-gradient-to-r from-[#8d36ff] via-[#d84fd2] to-[#21c6cc] hover:brightness-110"
                            >
                                {isCreating ? <Loader2 className="h-4 w-4 animate-spin" /> : <KeyRound className="h-4 w-4" />}
                                Anahtar oluştur
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Keys list */}
            {keys.length > 0 ? (
                <div className="space-y-3">
                    {keys.map((key) => (
                        <Card key={key.id}>
                            <CardContent className="flex flex-col gap-4 pt-6 md:flex-row md:items-center md:justify-between">
                                <div className="min-w-0 space-y-2">
                                    <div className="flex items-center gap-2">
                                        <KeyRound className="h-4 w-4 text-[#21c6cc]" />
                                        <span className="font-medium">{key.name || "İsimsiz anahtar"}</span>
                                        {key.revoked ? (
                                            <Badge variant="destructive">İptal edildi</Badge>
                                        ) : (
                                            <Badge variant="default">Aktif</Badge>
                                        )}
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        <code className="rounded bg-muted px-1 py-0.5 text-xs">
                                            {key.keyPrefix}…
                                        </code>{" "}
                                        · Son kullanım: {formatDate(key.lastUsedAt)} · Oluşturuldu:{" "}
                                        {formatDate(key.createdAt)}
                                    </p>
                                    <div className="flex flex-wrap items-center gap-1.5">
                                        <ShieldCheck className="h-3.5 w-3.5 text-muted-foreground" />
                                        {key.assistants.length > 0 ? (
                                            key.assistants.map((a) => (
                                                <Badge key={a.id} variant="secondary" className="text-xs">
                                                    {a.name}
                                                </Badge>
                                            ))
                                        ) : (
                                            <span className="text-xs text-muted-foreground">İzin yok</span>
                                        )}
                                    </div>
                                </div>

                                <div className="flex shrink-0 items-center gap-2">
                                    <Button variant="outline" size="sm" asChild>
                                        <Link to={`/admin/api-keys/${key.id}`}>Detay</Link>
                                    </Button>
                                    <Button variant="outline" size="sm" onClick={() => openEdit(key)}>
                                        İzinler
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        disabled={busyId === key.id}
                                        onClick={() =>
                                            patchKey(
                                                key.id,
                                                { revoked: !key.revoked },
                                                key.revoked ? "Anahtar etkinleştirildi" : "Anahtar iptal edildi",
                                            )
                                        }
                                        className="gap-1.5"
                                    >
                                        {busyId === key.id ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : key.revoked ? (
                                            <Check className="h-4 w-4" />
                                        ) : (
                                            <Ban className="h-4 w-4" />
                                        )}
                                        {key.revoked ? "Etkinleştir" : "İptal et"}
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        disabled={busyId === key.id}
                                        onClick={() => handleDelete(key.id)}
                                        className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <Card>
                    <CardContent className="py-16 text-center">
                        <KeyRound className="mx-auto mb-4 h-16 w-16 text-muted-foreground/20" />
                        <h3 className="mb-2 text-lg font-semibold">Henüz anahtar yok</h3>
                        <p className="mb-6 text-muted-foreground">
                            İlk API anahtarınızı oluşturun ve erişebileceği asistanları seçin.
                        </p>
                    </CardContent>
                </Card>
            )}

            {/* Reveal-once dialog */}
            <Dialog open={!!rawKey} onOpenChange={(o) => !o && setRawKey(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Anahtar oluşturuldu</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-3">
                        <p className="text-sm text-muted-foreground">
                            Bu anahtarı şimdi kopyalayın — bir daha gösterilmeyecek.
                        </p>
                        <div className="flex items-center gap-2">
                            <code className="flex-1 truncate rounded-md border bg-muted/50 px-3 py-2 text-sm">
                                {rawKey}
                            </code>
                            <Button variant="ghost" size="icon" onClick={() => rawKey && copy(rawKey)}>
                                <Copy className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button onClick={() => setRawKey(null)}>Tamam</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit permissions dialog */}
            <Dialog open={!!editKey} onOpenChange={(o) => !o && setEditKey(null)}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>İzinleri düzenle {editKey?.name ? `— ${editKey.name}` : ""}</DialogTitle>
                    </DialogHeader>
                    <div className="mt-4 space-y-4">
                        <AssistantChecklist
                            value={editSelected}
                            onToggle={(id) => toggle(editSelected, setEditSelected, id)}
                        />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setEditKey(null)}>
                            İptal
                        </Button>
                        <Button onClick={handleSaveEdit} disabled={isSavingEdit} className="gap-2">
                            {isSavingEdit && <Loader2 className="h-4 w-4 animate-spin" />}
                            Kaydet
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
