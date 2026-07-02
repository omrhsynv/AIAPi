import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useRevalidator } from "react-router";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
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
    ArrowLeft,
    Bot,
    Save,
    Loader2,
    Trash2,
    Globe,
    Lock,
    Users,
    FileText,
    Upload,
    Database,
    Plus,
    X,
    Search,
    UserPlus,
    Check,
    Terminal,
    Copy,
    ExternalLink,
} from "lucide-react";
import { prisma } from "~/lib/db.server";
import { toast } from "sonner";
import { cn } from "~/lib/utils";

interface AssistantData {
    id: string;
    name: string;
    slug: string | null;
    description: string | null;
    systemInstruction: string;
    vectorStoreId: string | null;
    vectorStoreName: string | null;
    model: string;
    color: string;
    isPublic: boolean;
    isActive: boolean;
    createdAt: Date;
    _count: { chats: number; userAccess: number; vectorStoreFiles: number };
    vectorStoreFiles: VectorStoreFileData[];
    userAccess: UserAccessData[];
}

interface VectorStoreFileData {
    id: string;
    openaiFileId: string;
    fileName: string;
    fileSize: number;
    status: string;
    createdAt: Date;
}

interface UserAccessData {
    id: string;
    userId: string;
    user: {
        id: string;
        name: string;
        email: string;
    };
    grantedAt: Date;
}

interface UserData {
    id: string;
    name: string;
    email: string;
}

interface LoaderData {
    assistant: AssistantData | null;
    allUsers: UserData[];
    appUrl: string;
}

export async function loader({ params }: { params: { assistantId: string } }): Promise<Response | LoaderData> {
    const assistant = await prisma.assistant.findUnique({
        where: { id: params.assistantId },
        include: {
            _count: { select: { chats: true, userAccess: true, vectorStoreFiles: true } },
            vectorStoreFiles: {
                orderBy: { createdAt: "desc" },
            },
            userAccess: {
                include: {
                    user: {
                        select: { id: true, name: true, email: true },
                    },
                },
                orderBy: { grantedAt: "desc" },
            },
        },
    });

    if (!assistant) {
        return new Response(null, {
            status: 302,
            headers: { Location: "/admin/assistants" },
        });
    }

    // Get all users for assignment (excluding ones already assigned)
    const assignedUserIds = assistant.userAccess.map((ua) => ua.userId);
    const allUsers = await prisma.user.findMany({
        where: {
            id: { notIn: assignedUserIds },
            role: { not: "admin" }, // Admins don't need assignment
        },
        select: { id: true, name: true, email: true },
        orderBy: { name: "asc" },
    });

    return { assistant, allUsers, appUrl: process.env.APP_URL || "" };
}

interface ComponentProps {
    loaderData: LoaderData;
}

export default function AssistantDetail({ loaderData }: ComponentProps) {
    const { assistant, allUsers, appUrl } = loaderData;
    const navigate = useNavigate();
    const revalidator = useRevalidator();
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Form state
    const [name, setName] = useState(assistant?.name || "");
    const [slug, setSlug] = useState(assistant?.slug || "");
    const [description, setDescription] = useState(assistant?.description || "");
    const [systemInstruction, setSystemInstruction] = useState(assistant?.systemInstruction || "");
    const [model, setModel] = useState(assistant?.model || "gpt-4.1-mini");
    const [color, setColor] = useState(assistant?.color || "#3B82F6");
    const [isPublic, setIsPublic] = useState(assistant?.isPublic ?? true);
    const [isActive, setIsActive] = useState(assistant?.isActive ?? true);

    // Loading states
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [deletingFileId, setDeletingFileId] = useState<string | null>(null);
    const [isAssigning, setIsAssigning] = useState(false);
    const [removingAccessId, setRemovingAccessId] = useState<string | null>(null);

    // Dialog states
    const [assignDialogOpen, setAssignDialogOpen] = useState(false);
    const [userSearch, setUserSearch] = useState("");
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

    if (!assistant) return null;

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const response = await fetch(`/api/admin/assistants/${assistant.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name,
                    slug,
                    description,
                    systemInstruction,
                    model,
                    color,
                    isPublic,
                    isActive,
                }),
            });

            if (response.ok) {
                toast.success("Asistan güncellendi");
                revalidator.revalidate();
            } else {
                const data = await response.json().catch(() => null);
                toast.error(data?.error || "Güncelleme başarısız");
            }
        } catch (error) {
            toast.error("Bir hata oluştu");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm("Bu asistanı silmek istediğinize emin misiniz?")) return;

        setIsDeleting(true);
        try {
            const response = await fetch(`/api/admin/assistants/${assistant.id}`, {
                method: "DELETE",
            });

            if (response.ok) {
                toast.success("Asistan silindi");
                navigate("/admin/assistants");
            } else {
                toast.error("Silme başarısız");
            }
        } catch (error) {
            toast.error("Bir hata oluştu");
        } finally {
            setIsDeleting(false);
        }
    };

    // File upload handler
    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setIsUploading(true);
        try {
            for (const file of Array.from(files)) {
                const formData = new FormData();
                formData.append("file", file);

                const response = await fetch(`/api/admin/assistants/${assistant.id}/files`, {
                    method: "POST",
                    body: formData,
                });

                if (response.ok) {
                    toast.success(`${file.name} yüklendi`);
                } else {
                    toast.error(`${file.name} yüklenemedi`);
                }
            }
            revalidator.revalidate();
        } catch (error) {
            toast.error("Dosya yükleme hatası");
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    // Delete file handler
    const handleDeleteFile = async (fileId: string) => {
        setDeletingFileId(fileId);
        try {
            const response = await fetch(
                `/api/admin/assistants/${assistant.id}/files?fileId=${fileId}`,
                { method: "DELETE" }
            );

            if (response.ok) {
                toast.success("Dosya silindi");
                revalidator.revalidate();
            } else {
                toast.error("Dosya silinemedi");
            }
        } catch (error) {
            toast.error("Bir hata oluştu");
        } finally {
            setDeletingFileId(null);
        }
    };

    // Assign users handler
    const handleAssignUsers = async () => {
        if (selectedUsers.length === 0) return;

        setIsAssigning(true);
        try {
            for (const userId of selectedUsers) {
                await fetch(`/api/admin/users/${userId}/access`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ assistantId: assistant.id }),
                });
            }
            toast.success(`${selectedUsers.length} Kullanıcıya erişim verildi`);
            setAssignDialogOpen(false);
            setSelectedUsers([]);
            setUserSearch("");
            revalidator.revalidate();
        } catch (error) {
            toast.error("Atama yapılamadı");
        } finally {
            setIsAssigning(false);
        }
    };

    // Remove user access handler
    const handleRemoveAccess = async (userId: string) => {
        setRemovingAccessId(userId);
        try {
            const response = await fetch(
                `/api/admin/users/${userId}/access?assistantId=${assistant.id}`,
                { method: "DELETE" }
            );

            if (response.ok) {
                toast.success("erişim kaldırıldı");
                revalidator.revalidate();
            } else {
                toast.error("erişim kaldırılamadı");
            }
        } catch (error) {
            toast.error("Bir hata oluştu");
        } finally {
            setRemovingAccessId(null);
        }
    };

    // Toggle user selection
    const toggleUserSelection = (userId: string) => {
        setSelectedUsers((prev) =>
            prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
        );
    };

    // Filter users by search
    const filteredUsers = allUsers.filter(
        (user) =>
            user.name.toLowerCase().includes(userSearch.toLowerCase()) ||
            user.email.toLowerCase().includes(userSearch.toLowerCase())
    );

    // Format file size
    const formatFileSize = (bytes: number) => {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    const colors = [
        "#3B82F6", "#10B981", "#8B5CF6", "#F59E0B",
        "#EF4444", "#EC4899", "#06B6D4", "#6366F1"
    ];

    // Agent API access — the key authenticates the caller; this agent is
    // addressed by its slug (or id). Prefer APP_URL, fall back to browser origin.
    const apiOrigin = appUrl || (typeof window !== "undefined" ? window.location.origin : "");
    const agentRef = assistant.slug || assistant.id;
    const apiEndpoint = `${apiOrigin}/api/v1/agents/${agentRef}`;
    const curlExample = `curl -N ${apiEndpoint} \\
  -H "Authorization: Bearer <API_KEY>" \\
  -H "Content-Type: application/json" \\
  -d '{"message":"Merhaba"}'`;

    const copyToClipboard = (text: string, label: string) => {
        navigator.clipboard.writeText(text).then(
            () => toast.success(`${label} kopyalandı`),
            () => toast.error("Kopyalanamadı"),
        );
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link to="/admin/assistants">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                </Link>
                <div className="flex items-center gap-3">
                    <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: color + "20", color: color }}
                    >
                        <Bot className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold">{assistant.name}</h1>
                        <div className="flex items-center gap-2 mt-1">
                            <Badge variant={isPublic ? "default" : "secondary"}>
                                {isPublic ? <Globe className="w-3 h-3 mr-1" /> : <Lock className="w-3 h-3 mr-1" />}
                                {isPublic ? "Herkese Açık" : "Özel"}
                            </Badge>
                            <Badge variant={isActive ? "default" : "destructive"}>
                                {isActive ? "Aktif" : "Pasif"}
                            </Badge>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-[#21c6cc]/10 flex items-center justify-center text-[#21c6cc]">
                                <Bot className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Toplam Sohbet</p>
                                <p className="text-2xl font-bold">{assistant._count.chats}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                                <Users className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Atanan Kullanıcı</p>
                                <p className="text-2xl font-bold">{assistant._count.userAccess}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-600">
                                <FileText className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Bilgi Dosyası</p>
                                <p className="text-2xl font-bold">{assistant._count.vectorStoreFiles}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
                {/* Edit Form */}
                <Card>
                    <CardHeader>
                        <CardTitle>Asistan Ayarları</CardTitle>
                        <CardDescription>Asistan bilgilerini düzenleyin</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Asistan Adı</Label>
                                <Input value={name} onChange={(e) => setName(e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label>Model</Label>
                                <select
                                    value={model}
                                    onChange={(e) => setModel(e.target.value)}
                                    className="w-full h-10 px-3 rounded-md border bg-background"
                                >
                                    <option value="gpt-4.1-mini">GPT-4.1 Mini</option>
                                    <option value="gpt-4.1">GPT-4.1</option>
                                    <option value="gpt-4o">GPT-4o</option>
                                    <option value="gpt-4o-mini">GPT-4o Mini</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Slug (API için)</Label>
                            <Input
                                value={slug}
                                onChange={(e) => setSlug(e.target.value)}
                                placeholder="orn: ustun-zeka (boş bırakılırsa id kullanılır)"
                            />
                            <p className="text-xs text-muted-foreground">
                                API çağrılarında asistan kimliği olarak kullanılır. Küçük harf, rakam ve tire.
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label>Açıklama</Label>
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
                                rows={6}
                            />
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

                        <div className="flex flex-wrap gap-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={isPublic}
                                    onChange={(e) => setIsPublic(e.target.checked)}
                                    className="w-4 h-4"
                                />
                                <span>Herkese Açık</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={isActive}
                                    onChange={(e) => setIsActive(e.target.checked)}
                                    className="w-4 h-4"
                                />
                                <span>Aktif</span>
                            </label>
                        </div>

                        <div className="flex gap-3 pt-4">
                            <Button
                                onClick={handleSave}
                                disabled={isSaving}
                                className="gap-2 bg-gradient-to-r from-[#8d36ff] via-[#d84fd2] to-[#21c6cc] hover:brightness-110"
                            >
                                {isSaving ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Kaydediliyor...
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-4 h-4" />
                                        Kaydet
                                    </>
                                )}
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={handleDelete}
                                disabled={isDeleting}
                                className="gap-2"
                            >
                                {isDeleting ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <Trash2 className="w-4 h-4" />
                                )}
                                Sil
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Vector Store / Knowledge Base */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    <Database className="w-5 h-5" />
                                    Bilgi Tabanı (Vector Store)
                                </CardTitle>
                                <CardDescription className="mt-1">
                                    Asistanın kullanacağı dokümanları yükleyin
                                </CardDescription>
                            </div>
                            <div>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    multiple
                                    accept=".pdf,.txt,.md,.docx,.doc,.csv,.json"
                                    onChange={handleFileUpload}
                                    className="hidden"
                                />
                                <Button
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={isUploading}
                                    size="sm"
                                    className="gap-2"
                                >
                                    {isUploading ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <Upload className="w-4 h-4" />
                                    )}
                                    Dosya Yükle
                                </Button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {assistant.vectorStoreId && (
                            <div className="mb-4 p-3 bg-muted/50 rounded-lg text-sm">
                                <p className="text-muted-foreground">
                                    <span className="font-medium">Vector Store ID:</span>{" "}
                                    <code className="text-xs bg-background px-1 py-0.5 rounded">
                                        {assistant.vectorStoreId}
                                    </code>
                                </p>
                            </div>
                        )}

                        {assistant.vectorStoreFiles.length > 0 ? (
                            <ScrollArea className="h-[300px]">
                                <div className="space-y-2">
                                    {assistant.vectorStoreFiles.map((file) => (
                                        <div
                                            key={file.id}
                                            className="flex items-center justify-between p-3 border rounded-lg bg-background hover:bg-muted/50 transition-colors"
                                        >
                                            <div className="flex items-center gap-3 min-w-0">
                                                <div className="w-10 h-10 rounded-lg bg-[#21c6cc]/10 flex items-center justify-center text-[#21c6cc] shrink-0">
                                                    <FileText className="w-5 h-5" />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="font-medium truncate">{file.fileName}</p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {formatFileSize(file.fileSize)} •{" "}
                                                        <Badge variant={file.status === "completed" ? "default" : "secondary"} className="text-[10px] px-1">
                                                            {file.status === "completed" ? "Hazır" : file.status}
                                                        </Badge>
                                                    </p>
                                                </div>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleDeleteFile(file.openaiFileId)}
                                                disabled={deletingFileId === file.openaiFileId}
                                                className="shrink-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                                            >
                                                {deletingFileId === file.openaiFileId ? (
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                ) : (
                                                    <Trash2 className="w-4 h-4" />
                                                )}
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </ScrollArea>
                        ) : (
                            <div className="text-center py-12 text-muted-foreground">
                                <Database className="w-12 h-12 mx-auto mb-3 opacity-30" />
                                <p className="font-medium">Henüz dosya yok</p>
                                <p className="text-sm mt-1">
                                    PDF, TXT, MD, DOCX gibi dosyalar yükleyebilirsiniz
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Agent API Access */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="flex items-center gap-2">
                                <Terminal className="w-5 h-5" />
                                API Erişimi
                            </CardTitle>
                            <CardDescription className="mt-1">
                                Bu asistanı bir API anahtarı ile dışarıdan çağırın. Tam dokümantasyon için sağdaki butona tıklayın.
                            </CardDescription>
                        </div>
                        <Button variant="outline" size="sm" asChild className="gap-2">
                            <Link to="/docs/agent-api" target="_blank" rel="noreferrer">
                                <ExternalLink className="w-4 h-4" />
                                Dokümantasyon
                            </Link>
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Endpoint */}
                    <div className="space-y-2">
                        <Label>Endpoint</Label>
                        <div className="flex items-center gap-2">
                            <code className="flex-1 min-w-0 truncate rounded-md border bg-muted/50 px-3 py-2 text-sm">
                                <span className="font-semibold text-[#21c6cc]">POST</span> {apiEndpoint}
                            </code>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => copyToClipboard(apiEndpoint, "Endpoint")}
                                title="Kopyala"
                            >
                                <Copy className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Auth note */}
                    <div className="rounded-lg bg-muted/50 p-3 text-sm text-muted-foreground">
                        Kimlik doğrulama:{" "}
                        <code className="text-xs bg-background px-1 py-0.5 rounded">
                            Authorization: Bearer &lt;API_KEY&gt;
                        </code>
. Anahtarları{" "}
                        <Link to="/admin/api-keys" className="text-[#21c6cc] hover:underline">
                            API Anahtarları
                        </Link>{" "}
                        sayfasından oluşturup bu asistana izin verin.
                    </div>

                    {/* curl example */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label>Örnek İstek</Label>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => copyToClipboard(curlExample, "Komut")}
                                className="gap-2 h-7"
                            >
                                <Copy className="w-3.5 h-3.5" />
                                Kopyala
                            </Button>
                        </div>
                        <pre className="overflow-x-auto rounded-md border bg-muted/50 p-3 text-xs leading-relaxed">
                            <code>{curlExample}</code>
                        </pre>
                    </div>
                </CardContent>
            </Card>

            {/* User Access Management - Only show for private assistants */}
            {!isPublic && (
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    <Users className="w-5 h-5" />
                                    Kullanıcı erişimi
                                </CardTitle>
                                <CardDescription className="mt-1">
                                    Bu asistan özel. Sadece aşağıdaki Kullanıcılar erişebilir.
                                </CardDescription>
                            </div>
                            <Dialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button size="sm" className="gap-2">
                                        <UserPlus className="w-4 h-4" />
                                        Kullanıcı Ata
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Kullanıcı Ata</DialogTitle>
                                    </DialogHeader>
                                    <div className="space-y-4 mt-4">
                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                            <Input
                                                placeholder="Kullanıcı ara..."
                                                value={userSearch}
                                                onChange={(e) => setUserSearch(e.target.value)}
                                                className="pl-9"
                                            />
                                        </div>

                                        {filteredUsers.length > 0 ? (
                                            <ScrollArea className="h-[300px] border rounded-lg">
                                                <div className="p-2 space-y-1">
                                                    {filteredUsers.map((user) => (
                                                        <button
                                                            key={user.id}
                                                            onClick={() => toggleUserSelection(user.id)}
                                                            className={cn(
                                                                "w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors",
                                                                selectedUsers.includes(user.id)
                                                                    ? "bg-[#21c6cc]/10 border border-[#21c6cc]/30"
                                                                    : "hover:bg-muted"
                                                            )}
                                                        >
                                                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#8d36ff] to-[#21c6cc] flex items-center justify-center text-white font-medium text-sm shrink-0">
                                                                {user.name?.charAt(0) || user.email.charAt(0)}
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <p className="font-medium truncate">{user.name}</p>
                                                                <p className="text-xs text-muted-foreground truncate">
                                                                    {user.email}
                                                                </p>
                                                            </div>
                                                            {selectedUsers.includes(user.id) && (
                                                                <Check className="w-5 h-5 text-[#21c6cc] shrink-0" />
                                                            )}
                                                        </button>
                                                    ))}
                                                </div>
                                            </ScrollArea>
                                        ) : (
                                            <div className="text-center py-8 text-muted-foreground border rounded-lg">
                                                <Users className="w-10 h-10 mx-auto mb-2 opacity-30" />
                                                <p>Atanabilecek Kullanıcı bulunamadı</p>
                                            </div>
                                        )}

                                        {selectedUsers.length > 0 && (
                                            <p className="text-sm text-muted-foreground">
                                                {selectedUsers.length} Kullanıcı seçildi
                                            </p>
                                        )}
                                    </div>
                                    <DialogFooter>
                                        <Button variant="outline" onClick={() => setAssignDialogOpen(false)}>
                                            İptal
                                        </Button>
                                        <Button
                                            onClick={handleAssignUsers}
                                            disabled={selectedUsers.length === 0 || isAssigning}
                                            className="gap-2"
                                        >
                                            {isAssigning ? (
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                            ) : (
                                                <Plus className="w-4 h-4" />
                                            )}
                                            erişim Ver
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {assistant.userAccess.length > 0 ? (
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                                {assistant.userAccess.map((access) => (
                                    <div
                                        key={access.id}
                                        className="flex items-center justify-between p-3 border rounded-lg bg-background"
                                    >
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#8d36ff] to-[#21c6cc] flex items-center justify-center text-white font-medium shrink-0">
                                                {access.user.name?.charAt(0) || access.user.email.charAt(0)}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="font-medium truncate">{access.user.name}</p>
                                                <p className="text-xs text-muted-foreground truncate">
                                                    {access.user.email}
                                                </p>
                                            </div>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleRemoveAccess(access.userId)}
                                            disabled={removingAccessId === access.userId}
                                            className="shrink-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                                        >
                                            {removingAccessId === access.userId ? (
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                            ) : (
                                                <X className="w-4 h-4" />
                                            )}
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 text-muted-foreground">
                                <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
                                <p className="font-medium">Henüz Kullanıcı atanmamış</p>
                                <p className="text-sm mt-1">
                                    erişim vermek için Kullanıcı atayın.
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
