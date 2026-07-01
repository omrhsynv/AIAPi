import { useState } from "react";
import { Link, useRevalidator } from "react-router";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "~/components/ui/dialog";
import { Badge } from "~/components/ui/badge";
import { Bot, Plus, ArrowRight, Loader2, Globe, Lock } from "lucide-react";
import { prisma } from "~/lib/db.server";

interface AssistantData {
    id: string;
    name: string;
    description: string | null;
    systemInstruction: string;
    model: string;
    color: string;
    isPublic: boolean;
    isActive: boolean;
    _count: { chats: number; userAccess: number };
}

interface LoaderData {
    assistants: AssistantData[];
}

export async function loader(): Promise<LoaderData> {
    const assistants = await prisma.assistant.findMany({
        select: {
            id: true,
            name: true,
            description: true,
            systemInstruction: true,
            model: true,
            color: true,
            isPublic: true,
            isActive: true,
            _count: { select: { chats: true, userAccess: true } },
        },
        orderBy: { createdAt: "desc" },
    });

    return { assistants };
}

interface ComponentProps {
    loaderData: LoaderData;
}

export default function AdminAssistants({ loaderData }: ComponentProps) {
    const { assistants } = loaderData;
    const revalidator = useRevalidator();
    const [isCreating, setIsCreating] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    // Form state
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [systemInstruction, setSystemInstruction] = useState(
        "Sen yardımcı bir AI asistanısın. Kullanıcıların sorularına Açık ve anlaşılır cevaplar ver."
    );
    const [model, setModel] = useState("gpt-4.1-mini");
    const [color, setColor] = useState("#3B82F6");
    const [isPublic, setIsPublic] = useState(true);

    const handleCreate = async () => {
        if (!name.trim()) return;

        setIsCreating(true);
        try {
            const response = await fetch("/api/admin/assistants", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name,
                    description,
                    systemInstruction,
                    model,
                    color,
                    isPublic,
                }),
            });

            if (response.ok) {
                setIsDialogOpen(false);
                setName("");
                setDescription("");
                revalidator.revalidate();
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsCreating(false);
        }
    };

    const colors = [
        "#3B82F6", "#10B981", "#8B5CF6", "#F59E0B",
        "#EF4444", "#EC4899", "#06B6D4", "#6366F1"
    ];

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Asistanlar</h1>
                    <p className="text-muted-foreground mt-1">AI asistanlarını yönetin</p>
                </div>

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="gap-2 bg-gradient-to-r from-[#8d36ff] via-[#d84fd2] to-[#21c6cc] hover:brightness-110">
                            <Plus className="w-4 h-4" />
                            Yeni Asistan
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-lg">
                        <DialogHeader>
                            <DialogTitle>Yeni Asistan oluştur</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 mt-4">
                            <div className="space-y-2">
                                <Label>Asistan Adı</Label>
                                <Input
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Orn: Genel Asistan"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Açıklama (opsiyonel)</Label>
                                <Input
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Kısa bir Açıklama"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Sistem Talimatı</Label>
                                <Textarea
                                    value={systemInstruction}
                                    onChange={(e) => setSystemInstruction(e.target.value)}
                                    placeholder="AI'ın nasıl davranacağını belirleyin..."
                                    rows={4}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Model</Label>
                                <select
                                    value={model}
                                    onChange={(e) => setModel(e.target.value)}
                                    className="w-full h-10 px-3 rounded-md border bg-background"
                                >
                                    <option value="gpt-4.1-mini">GPT-4.1 Mini (Hızlı)</option>
                                    <option value="gpt-4.1">GPT-4.1 (Güçlü)</option>
                                    <option value="gpt-4o">GPT-4o</option>
                                    <option value="gpt-4o-mini">GPT-4o Mini</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <Label>Renk</Label>
                                <div className="flex gap-2 flex-wrap">
                                    {colors.map((c) => (
                                        <button
                                            key={c}
                                            onClick={() => setColor(c)}
                                            className={`w-8 h-8 rounded-full transition-all ${color === c ? "ring-2 ring-offset-2 ring-[#21c6cc]" : ""
                                                }`}
                                            style={{ backgroundColor: c }}
                                        />
                                    ))}
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="isPublic"
                                    checked={isPublic}
                                    onChange={(e) => setIsPublic(e.target.checked)}
                                    className="w-4 h-4"
                                />
                                <Label htmlFor="isPublic" className="cursor-pointer">
                                    Herkese Açık (Tüm Kullanıcılar erişebilir)
                                </Label>
                            </div>

                            <Button
                                onClick={handleCreate}
                                disabled={!name.trim() || isCreating}
                                className="w-full bg-gradient-to-r from-[#8d36ff] via-[#d84fd2] to-[#21c6cc] hover:brightness-110"
                            >
                                {isCreating ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        oluşturuluyor...
                                    </>
                                ) : (
                                    "Asistan oluştur"
                                )}
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Assistants Grid */}
            {assistants.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {assistants.map((assistant) => (
                        <Link key={assistant.id} to={`/admin/assistants/${assistant.id}`}>
                            <Card className="h-full hover:border-[#21c6cc]/50 transition-colors cursor-pointer">
                                <CardContent className="pt-6">
                                    <div className="flex items-start gap-4">
                                        <div
                                            className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                                            style={{ backgroundColor: assistant.color + "20", color: assistant.color }}
                                        >
                                            <Bot className="w-6 h-6" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-semibold truncate">{assistant.name}</h3>
                                                {!assistant.isActive && (
                                                    <Badge variant="secondary" className="text-xs">Pasif</Badge>
                                                )}
                                            </div>
                                            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                                                {assistant.description || assistant.systemInstruction.slice(0, 100)}
                                            </p>
                                            <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
                                                <span className="flex items-center gap-1">
                                                    {assistant.isPublic ? <Globe className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                                                    {assistant.isPublic ? "Herkese Açık" : "Özel"}
                                                </span>
                                                <span>{assistant._count.chats} sohbet</span>
                                                <span>{assistant._count.userAccess} erişim</span>
                                            </div>
                                        </div>
                                        <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0" />
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            ) : (
                <Card>
                    <CardContent className="py-16 text-center">
                        <Bot className="w-16 h-16 mx-auto text-muted-foreground/20 mb-4" />
                        <h3 className="text-lg font-semibold mb-2">Henüz Asistan Yok</h3>
                        <p className="text-muted-foreground mb-6">
                            İlk AI asistanınızı oluşturarak başlayın
                        </p>
                        <Button onClick={() => setIsDialogOpen(true)} className="gap-2 bg-gradient-to-r from-[#8d36ff] via-[#d84fd2] to-[#21c6cc] hover:brightness-110">
                            <Plus className="w-4 h-4" />
                            İlk Asistanı oluştur
                        </Button>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
