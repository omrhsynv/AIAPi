import { Outlet, Link, useLocation, useNavigate } from "react-router";
import { Button } from "~/components/ui/button";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "~/components/ui/sheet";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "~/components/ui/tooltip";
import {
    MessageSquare,
    Plus,
    Menu,
    LogOut,
    User,
    Moon,
    Sun,
    PanelLeftClose,
    PanelLeftOpen,
    Trash2,
    Settings,
} from "lucide-react";
import { BrandMark } from "~/components/brand-mark";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { auth } from "~/lib/auth.server";
import { prisma } from "~/lib/db.server";
import { cn } from "~/lib/utils";

// Types
interface UserData {
    id: string;
    name: string | null;
    email: string | null;
    role: string;
}

interface AssistantData {
    id: string;
    name: string;
    color: string;
    icon: string;
}

interface ChatData {
    id: string;
    title: string | null;
    assistantId: string;
    updatedAt: Date;
}

interface LoaderData {
    user: UserData;
    assistants: AssistantData[];
    chats: ChatData[];
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

        const userId = session.user.id as string;

        // Get user from database
        const dbUser = await prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, name: true, email: true, role: true },
        });

        if (!dbUser) {
            return new Response(null, {
                status: 302,
                headers: { Location: "/login" },
            });
        }

        // Get accessible assistants for this user
        let assistants: AssistantData[] = [];

        if (dbUser.role === "admin") {
            // Admins can access all active assistants
            assistants = await prisma.assistant.findMany({
                where: { isActive: true },
                select: { id: true, name: true, color: true, icon: true },
                orderBy: { name: "asc" },
            });
        } else {
            // Regular users can only access public assistants or granted ones
            assistants = await prisma.assistant.findMany({
                where: {
                    isActive: true,
                    OR: [
                        { isPublic: true },
                        { userAccess: { some: { userId } } },
                    ],
                },
                select: { id: true, name: true, color: true, icon: true },
                orderBy: { name: "asc" },
            });
        }

        // Get user's recent chats
        const chats = await prisma.chat.findMany({
            where: { userId },
            select: {
                id: true,
                title: true,
                assistantId: true,
                updatedAt: true,
            },
            orderBy: { updatedAt: "desc" },
            take: 50,
        });

        return { user: dbUser, assistants, chats };
    } catch (error) {
        console.error("App layout loader error:", error);
        return new Response(null, {
            status: 302,
            headers: { Location: "/login" },
        });
    }
}

interface ComponentProps {
    loaderData: LoaderData;
}

export default function AppLayout({ loaderData }: ComponentProps) {
    const { user, assistants, chats } = loaderData;
    const location = useLocation();
    const navigate = useNavigate();
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    // Prevent hydration mismatch
    useEffect(() => {
        setMounted(true);
    }, []);

    const handleLogout = () => {
        // Redirect to server-side logout which clears cookies
        window.location.href = "/api/logout";
    };

    const handleDeleteChat = async (e: React.MouseEvent, chatId: string) => {
        e.preventDefault();
        e.stopPropagation();

        await fetch(`/api/user/chats?chatId=${chatId}`, { method: "DELETE" });
        // Reload page to refresh chat list
        window.location.reload();
    };

    const Sidebar = ({ mobile = false }: { mobile?: boolean }) => (
        <div className={cn("flex flex-col h-full bg-sidebar border-r border-sidebar-border", mobile ? "w-full" : "w-full h-full")}>
            {/* Header */}
            {!isSidebarCollapsed && (
                <div className="p-2 sm:p-3 lg:p-4 border-b border-sidebar-border">
                    <div className="flex items-center justify-between mb-2 sm:mb-3">
                        <Link to="/chat" className="flex items-center gap-1 sm:gap-2 font-bold text-base sm:text-lg lg:text-lg text-sidebar-foreground">
                            <BrandMark size="sm" />
                            <span className="hidden sm:inline">ArisAI</span>
                        </Link>
                        {!mobile && (
                            <Button variant="ghost" size="icon" onClick={() => setIsSidebarCollapsed(true)} className="h-7 w-7 sm:h-8 sm:w-8">
                                <PanelLeftClose className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-sidebar-foreground/60" />
                            </Button>
                        )}
                    </div>
                    <Link to="/chat" onClick={() => mobile && setSidebarOpen(false)}>
                        <Button className="w-full gap-1 sm:gap-2 bg-gradient-to-r from-[#8d36ff] via-[#d84fd2] to-[#21c6cc] text-xs sm:text-sm font-bold text-white hover:brightness-110">
                            <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span className="hidden sm:inline">Yeni Sohbet</span>
                            <span className="sm:hidden">Yeni</span>
                        </Button>
                    </Link>
                </div>
            )}

            {/* Collapsed Header */}
            {!mobile && isSidebarCollapsed && (
                <div className="p-2 sm:p-3 lg:p-4 flex flex-col items-center gap-2 sm:gap-3 border-b border-sidebar-border">
                    <Link to="/chat">
                        <BrandMark size="sm" />
                    </Link>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Link to="/chat">
                                    <Button size="icon" className="h-8 w-8 bg-gradient-to-r from-[#8d36ff] to-[#21c6cc] text-white hover:brightness-110 sm:h-9 sm:w-9">
                                        <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                                    </Button>
                                </Link>
                            </TooltipTrigger>
                            <TooltipContent side="right">Yeni Sohbet</TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" onClick={() => setIsSidebarCollapsed(false)} className="h-7 w-7 sm:h-8 sm:w-8">
                                    <PanelLeftOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="right">Genişlet</TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            )}

            {/* Chat History */}
            <ScrollArea className="flex-1 overflow-hidden">
                <div className="px-2 sm:px-3 py-2 h-full flex flex-col">
                    {!isSidebarCollapsed && (
                        <p className="text-xs sm:text-xs font-semibold text-sidebar-foreground/50 uppercase tracking-wider px-1 sm:px-2 mb-2">
                            Sohbet Geçmişi
                        </p>
                    )}
                    <div className="space-y-1">
                    {chats.map((chat) => (
                        <Link
                            key={chat.id}
                            to={`/chat/${chat.id}`}
                            onClick={() => mobile && setSidebarOpen(false)}
                            className={cn(
                                "group flex items-center gap-1 sm:gap-2 rounded-lg transition-colors",
                                isSidebarCollapsed ? "justify-center p-2" : "px-2 sm:px-3 py-1.5 sm:py-2",
                                location.pathname === `/chat/${chat.id}`
                                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50"
                            )}
                        >
                            {isSidebarCollapsed ? (
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger>
                                            <MessageSquare className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                        </TooltipTrigger>
                                        <TooltipContent side="right">{chat.title || "Sohbet"}</TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            ) : (
                                <>
                                    <MessageSquare className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                                    <span className="truncate text-xs sm:text-sm flex-1 line-clamp-1">{chat.title || "Yeni Sohbet"}</span>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-5 w-5 sm:h-6 sm:w-6 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                                        onClick={(e) => handleDeleteChat(e, chat.id)}
                                    >
                                        <Trash2 className="w-3 h-3 text-destructive" />
                                    </Button>
                                </>
                            )}
                        </Link>
                    ))}
                    {chats.length === 0 && !isSidebarCollapsed && (
                        <div className="text-center py-6 sm:py-8 text-sidebar-foreground/40 text-xs sm:text-sm">
                            <MessageSquare className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 opacity-50" />
                            Henüz sohbet yok
                        </div>
                    )}
                </div>
                </div>
            </ScrollArea>

            {/* Footer */}
            <div className="p-2 sm:p-3 border-t border-sidebar-border space-y-1.5 sm:space-y-2">
                {/* Theme Toggle */}
                {mounted && (
                    <div className={cn(isSidebarCollapsed ? "flex justify-center" : "")}>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size={isSidebarCollapsed ? "icon" : "sm"}
                                        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                                        className={cn(!isSidebarCollapsed && "w-full justify-start gap-1 sm:gap-2 text-xs sm:text-sm")}
                                    >
                                        {theme === "dark" ? <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                                        {!isSidebarCollapsed && (theme === "dark" ? "Açık Tema" : "Koyu Tema")}
                                    </Button>
                                </TooltipTrigger>
                                {isSidebarCollapsed && <TooltipContent side="right">Tema Değiştir</TooltipContent>}
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                )}

                {/* User Info & Logout */}
                {!isSidebarCollapsed ? (
                    <div className="flex items-center gap-2 sm:gap-3 p-1.5 sm:p-2 rounded-lg bg-sidebar-accent/30">
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#8d36ff] to-[#21c6cc] text-xs font-bold text-white sm:h-9 sm:w-9 sm:text-sm">
                            {user.name?.charAt(0) || user.email?.charAt(0) || "U"}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs sm:text-sm font-medium truncate text-sidebar-foreground">{user.name || "Kullanıcı"}</p>
                            <p className="text-xs text-sidebar-foreground/60 truncate hidden sm:block">{user.email}</p>
                        </div>
                        <Button variant="ghost" size="icon" className="shrink-0 h-7 w-7 sm:h-8 sm:w-8" onClick={handleLogout}>
                            <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-sidebar-foreground/60" />
                        </Button>
                    </div>
                ) : (
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" onClick={handleLogout}>
                                    <LogOut className="w-4 h-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="right">Çıkış Yap</TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                )}

                {/* Admin Link */}
                {user.role === "admin" && !isSidebarCollapsed && (
                    <Link to="/admin/dashboard">
                        <Button variant="outline" size="sm" className="w-full gap-1 sm:gap-2 text-xs sm:text-sm">
                            <Settings className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            <span className="hidden sm:inline">yönetim Paneli</span>
                            <span className="sm:hidden">yönetim</span>
                        </Button>
                    </Link>
                )}
            </div>
        </div>
    );

    return (
        <div className="aris-app-surface flex h-screen overflow-hidden">
            {/* Desktop Sidebar */}
            <aside
                className={cn(
                    "hidden md:flex transition-all duration-300 ease-in-out",
                    isSidebarCollapsed ? "w-[50px] lg:w-[60px]" : "w-[240px] lg:w-[280px]"
                )}
            >
                <Sidebar />
            </aside>

            {/* Mobile Sidebar */}
            <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
                <SheetContent side="left" className="p-0 w-[280px] sm:w-[320px]">
                    <Sidebar mobile />
                </SheetContent>
            </Sheet>

            {/* Main Content */}
            <main className="flex-1 flex flex-col relative w-full h-full overflow-hidden">
                {/* Mobile Header */}
                <div className="z-10 flex items-center justify-between gap-2 border-b border-white/10 bg-[#141524]/90 p-3 backdrop-blur-md sm:p-4 md:hidden">
                    <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-9 sm:w-9" onClick={() => setSidebarOpen(true)}>
                        <Menu className="w-4 h-4 sm:w-5 sm:h-5" />
                    </Button>
                    <span className="text-sm font-bold sm:text-base">ArisAI</span>
                    <div className="w-8 sm:w-9" />
                </div>

                <Outlet />
            </main>
        </div>
    );
}
