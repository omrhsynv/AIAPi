import { Link } from "react-router";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Users, Shield, User, ArrowRight, Bot } from "lucide-react";
import { prisma } from "~/lib/db.server";

interface UserData {
    id: string;
    name: string;
    email: string;
    role: string;
    createdAt: Date;
    _count: { chats: number; accessGrants: number };
}

interface LoaderData {
    users: UserData[];
}

export async function loader(): Promise<LoaderData> {
    const users = await prisma.user.findMany({
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true,
            _count: { select: { chats: true, accessGrants: true } },
        },
        orderBy: { createdAt: "desc" },
    });

    return { users };
}

interface ComponentProps {
    loaderData: LoaderData;
}

export default function AdminUsers({ loaderData }: ComponentProps) {
    const { users } = loaderData;

    const admins = users.filter(u => u.role === "admin");
    const regularUsers = users.filter(u => u.role !== "admin");

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Kullanıcılar</h1>
                <p className="text-muted-foreground mt-1">Kullanıcıları ve erişim yetkilerini yönetin</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-[#21c6cc]/10 flex items-center justify-center text-[#21c6cc]">
                                <Users className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Toplam Kullanıcı</p>
                                <p className="text-2xl font-bold">{users.length}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600">
                                <Shield className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Yöneticiler</p>
                                <p className="text-2xl font-bold">{admins.length}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                                <User className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Normal Kullanıcılar</p>
                                <p className="text-2xl font-bold">{regularUsers.length}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Users List */}
            <Card>
                <CardHeader>
                    <CardTitle>Tüm Kullanıcılar</CardTitle>
                    <CardDescription>Kullanıcı listesi ve erişim durumları</CardDescription>
                </CardHeader>
                <CardContent>
                    {users.length > 0 ? (
                        <div className="space-y-2">
                            {users.map((user) => (
                                <div
                                    key={user.id}
                                    className="flex items-center gap-4 p-4 rounded-lg hover:bg-secondary transition-colors"
                                >
                                    <div className="w-10 h-10 rounded-full bg-[#21c6cc] flex items-center justify-center text-white font-medium">
                                        {user.name?.charAt(0) || user.email?.charAt(0) || "U"}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <p className="font-medium truncate">{user.name}</p>
                                            <Badge variant={user.role === "admin" ? "default" : "secondary"}>
                                                {user.role === "admin" ? "Yönetici" : "Kullanıcı"}
                                            </Badge>
                                        </div>
                                        <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                                    </div>
                                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                        <span className="flex items-center gap-1">
                                            <Bot className="w-4 h-4" />
                                            {user._count.accessGrants} asistan
                                        </span>
                                        <span>{user._count.chats} sohbet</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <Users className="w-16 h-16 mx-auto text-muted-foreground/20 mb-4" />
                            <h3 className="text-lg font-semibold mb-2">Henüz Kullanıcı Yok</h3>
                            <p className="text-muted-foreground">
                                Kullanıcılar kayit oldukça burada görünecekler
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
