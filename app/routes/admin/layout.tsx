import { Outlet, Link, useLocation, useNavigate } from "react-router";
import { Button } from "~/components/ui/button";
import { ScrollArea } from "~/components/ui/scroll-area";
import {
    Bot,
    LayoutDashboard,
    Users,
    Settings,
    LogOut,
    Menu,
    X,
    ExternalLink,
    Moon,
    Sun,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { auth } from "~/lib/auth.server";
import { prisma } from "~/lib/db.server";

interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    role?: string;
}

interface LoaderData {
    user: User;
}

export async function loader({ request }: { request: Request }): Promise<Response | LoaderData> {
    try {
        const session = await auth.api.getSession({
            headers: request.headers,
        });

        if (!session?.user) {
            return new Response(null, {
                status: 302,
                headers: { Location: "/login" },
            });
        }

        // Check if admin from database
        const dbUser = await prisma.user.findUnique({
            where: { id: session.user.id as string },
            select: { id: true, name: true, email: true, role: true },
        });

        if (!dbUser || dbUser.role !== "admin") {
            return new Response(null, {
                status: 302,
                headers: { Location: "/chat" },
            });
        }

        return { user: dbUser };
    } catch (error) {
        console.error("Admin layout loader error:", error);
        return new Response(null, {
            status: 302,
            headers: { Location: "/login" },
        });
    }
}

const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/admin/dashboard" },
    { icon: Bot, label: "Asistanlar", href: "/admin/assistants" },
    { icon: Users, label: "Kullanıcılar", href: "/admin/users" },
    { icon: Settings, label: "Ayarlar", href: "/admin/settings" },
];

interface ComponentProps {
    loaderData: LoaderData;
}

export default function AdminLayout({ loaderData }: ComponentProps) {
    const { user } = loaderData;
    const location = useLocation();
    const navigate = useNavigate();
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleLogout = () => {
        // Redirect to server-side logout which clears cookies
        window.location.href = "/api/logout";
    };

    const Sidebar = () => (
        <div className="flex h-full flex-col border-r border-white/10 bg-[#141524]/95 shadow-2xl shadow-black/25 backdrop-blur-xl">
            <div className="p-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#8d36ff] to-[#21c6cc] flex items-center justify-center">
                        <Bot className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="font-bold text-lg">ArisAI</h1>
                        <p className="text-xs text-muted-foreground">Admin Panel</p>
                    </div>
                </div>
            </div>

            <ScrollArea className="flex-1 px-4">
                <nav className="space-y-1">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                to={item.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive
                                    ? "bg-[#21c6cc]/10 text-[#21c6cc] font-medium"
                                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                                    }`}
                            >
                                <item.icon className="w-5 h-5" />
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>
            </ScrollArea>

            <div className="p-4 border-t space-y-3">
                <Button variant="outline" asChild className="w-full justify-start gap-2">
                    <Link to="/chat">
                        <ExternalLink className="w-4 h-4" />
                        Sohbete Git
                    </Link>
                </Button>

                {mounted && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                        className="w-full justify-start gap-2"
                    >
                        {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                        {theme === "dark" ? "Açık Tema" : "Koyu Tema"}
                    </Button>
                )}

                <div className="flex items-center gap-3 p-2 rounded-lg bg-secondary/50">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#8d36ff] to-[#21c6cc] flex items-center justify-center text-white font-medium">
                        {user.name?.charAt(0) || user.email?.charAt(0) || "A"}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{user.name || "Yönetici"}</p>
                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                    </div>
                </div>

                <Button
                    variant="ghost"
                    className="w-full gap-2 text-destructive hover:bg-destructive/10 justify-start"
                    onClick={handleLogout}
                >
                    <LogOut className="w-4 h-4" />
                    Çıkış Yap
                </Button>
            </div>
        </div>
    );

    return (
        <div className="aris-app-surface min-h-screen">
            {/* Desktop Sidebar */}
            <aside className="fixed left-0 top-0 h-full w-72 hidden lg:block">
                <Sidebar />
            </aside>

            {/* Mobile Header */}
            <header className="fixed left-0 right-0 top-0 z-50 flex h-16 items-center justify-between border-b border-white/10 bg-[#141524]/90 px-4 backdrop-blur-md lg:hidden">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#8d36ff] to-[#21c6cc] flex items-center justify-center">
                        <Bot className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-bold">ArisAI Admin</span>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                    {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </Button>
            </header>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="fixed inset-0 z-40 bg-background/80 pt-16 backdrop-blur-sm lg:hidden">
                    <div className="h-full w-4/5 max-w-sm border-r border-white/10 bg-[#141524] shadow-2xl">
                        <Sidebar />
                    </div>
                </div>
            )}

            {/* Main Content */}
            <main className="lg:ml-72 pt-16 lg:pt-0 min-h-screen">
                <div className="p-4 lg:p-8 max-w-7xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
