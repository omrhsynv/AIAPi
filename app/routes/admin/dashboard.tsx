import { Link } from "react-router";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Bot, Users, MessageSquare, TrendingUp, ArrowRight, Plus } from "lucide-react";
import { prisma } from "~/lib/db.server";

interface Stats {
    totalUsers: number;
    totalAssistants: number;
    totalChats: number;
    totalMessages: number;
}

interface RecentAssistant {
    id: string;
    name: string;
    color: string;
    _count: { chats: number };
}

interface LoaderData {
    stats: Stats;
    recentAssistants: RecentAssistant[];
}

export async function loader(): Promise<LoaderData> {
    const [totalUsers, totalAssistants, totalChats, totalMessages, recentAssistants] = await Promise.all([
        prisma.user.count(),
        prisma.assistant.count({ where: { isActive: true } }),
        prisma.chat.count(),
        prisma.message.count(),
        prisma.assistant.findMany({
            where: { isActive: true },
            select: {
                id: true,
                name: true,
                color: true,
                _count: { select: { chats: true } },
            },
            orderBy: { createdAt: "desc" },
            take: 5,
        }),
    ]);

    return {
        stats: { totalUsers, totalAssistants, totalChats, totalMessages },
        recentAssistants,
    };
}

interface ComponentProps {
    loaderData: LoaderData;
}

export default function AdminDashboard({ loaderData }: ComponentProps) {
    const { stats, recentAssistants } = loaderData;

    const statCards = [
        {
            title: "Toplam Kullanıcı",
            value: stats.totalUsers,
            icon: Users,
            color: "text-[#21c6cc]",
            bg: "bg-[#21c6cc]/10",
        },
        {
            title: "Asistanlar",
            value: stats.totalAssistants,
            icon: Bot,
            color: "text-emerald-600",
            bg: "bg-emerald-500/10",
        },
        {
            title: "Sohbetler",
            value: stats.totalChats,
            icon: MessageSquare,
            color: "text-violet-600",
            bg: "bg-violet-500/10",
        },
        {
            title: "Mesajlar",
            value: stats.totalMessages,
            icon: TrendingUp,
            color: "text-amber-600",
            bg: "bg-amber-500/10",
        },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Dashboard</h1>
                <p className="text-muted-foreground mt-1">ArisAI yönetim paneline hoş geldiniz</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {statCards.map((stat) => (
                    <Card key={stat.title} className="border-border/50">
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                                    <p className="text-3xl font-bold mt-1">{stat.value}</p>
                                </div>
                                <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center ${stat.color}`}>
                                    <stat.icon className="w-6 h-6" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Quick Actions & Assistants */}
            <div className="grid lg:grid-cols-2 gap-8">
                {/* Quick Actions */}
                <Card>
                    <CardHeader>
                        <CardTitle>Hızlı Islemler</CardTitle>
                        <CardDescription>Sık kullanılan islemlere erisin</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <Link to="/admin/assistants">
                            <Button variant="outline" className="w-full justify-between group">
                                <span className="flex items-center gap-2">
                                    <Plus className="w-4 h-4" />
                                    Yeni Asistan oluştur
                                </span>
                                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </Button>
                        </Link>
                        <Link to="/admin/users">
                            <Button variant="outline" className="w-full justify-between group">
                                <span className="flex items-center gap-2">
                                    <Users className="w-4 h-4" />
                                    Kullanıcıları Yönet
                                </span>
                                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </Button>
                        </Link>
                        <Link to="/admin/settings">
                            <Button variant="outline" className="w-full justify-between group">
                                <span className="flex items-center gap-2">
                                    <Bot className="w-4 h-4" />
                                    Uygulama Ayarları
                                </span>
                                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </Button>
                        </Link>
                    </CardContent>
                </Card>

                {/* Recent Assistants */}
                <Card>
                    <CardHeader>
                        <CardTitle>Asistanlar</CardTitle>
                        <CardDescription>Aktif AI asistanları</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {recentAssistants.length > 0 ? (
                            <div className="space-y-3">
                                {recentAssistants.map((assistant) => (
                                    <Link
                                        key={assistant.id}
                                        to={`/admin/assistants/${assistant.id}`}
                                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary transition-colors"
                                    >
                                        <div
                                            className="w-10 h-10 rounded-lg flex items-center justify-center"
                                            style={{ backgroundColor: assistant.color + "20", color: assistant.color }}
                                        >
                                            <Bot className="w-5 h-5" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-medium">{assistant.name}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {assistant._count.chats} sohbet
                                            </p>
                                        </div>
                                        <ArrowRight className="w-4 h-4 text-muted-foreground" />
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <Bot className="w-12 h-12 mx-auto text-muted-foreground/20 mb-3" />
                                <p className="text-muted-foreground">Henüz asistan yok</p>
                                <Link to="/admin/assistants">
                                    <Button size="sm" className="mt-3">
                                        <Plus className="w-4 h-4 mr-2" />
                                        İlk Asistanı oluştur
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
