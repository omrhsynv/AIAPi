import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useSearchParams, useNavigate, useRevalidator } from "react-router";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import { ScrollArea } from "~/components/ui/scroll-area";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
    Bot,
    SendHorizontal,
    Loader2,
    Sparkles,
    ChevronDown,
    Check,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "~/lib/utils";
import { MarkdownRenderer } from "~/components/markdown-renderer";
import { AutoSpeakToggle, MessageSpeaker } from "~/components/message-speaker";
import { VoiceInputButton } from "~/components/voice-input-button";
import { useSpeech } from "~/hooks/use-speech";
import { auth } from "~/lib/auth.server";
import { prisma } from "~/lib/db.server";

// Types
interface MessageData {
    id: string;
    role: string;
    content: string;
    createdAt: Date;
}

interface ChatData {
    id: string;
    title: string | null;
    assistantId: string;
    assistant: {
        id: string;
        name: string;
        color: string;
    };
    messages: MessageData[];
}

interface AssistantData {
    id: string;
    name: string;
    description: string | null;
    color: string;
}

interface LoaderData {
    chat: ChatData | null;
    assistants: AssistantData[];
    userId: string;
}

export async function loader({ request, params }: { request: Request; params: { chatId?: string } }): Promise<Response | LoaderData> {
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
    const userRole = (session.user as any).role as string;

    // Get accessible assistants
    let assistants: AssistantData[] = [];

    if (userRole === "admin") {
        assistants = await prisma.assistant.findMany({
            where: { isActive: true },
            select: { id: true, name: true, description: true, color: true },
            orderBy: { name: "asc" },
        });
    } else {
        assistants = await prisma.assistant.findMany({
            where: {
                isActive: true,
                OR: [
                    { isPublic: true },
                    { userAccess: { some: { userId } } },
                ],
            },
            select: { id: true, name: true, description: true, color: true },
            orderBy: { name: "asc" },
        });
    }

    // Get chat if chatId provided
    let chat: ChatData | null = null;

    if (params.chatId) {
        chat = await prisma.chat.findFirst({
            where: {
                id: params.chatId,
                userId,
            },
            include: {
                assistant: {
                    select: { id: true, name: true, color: true },
                },
                messages: {
                    orderBy: { createdAt: "asc" },
                },
            },
        });
    }

    return { chat, assistants, userId };
}

interface ComponentProps {
    loaderData: LoaderData;
}

export default function ChatPage({ loaderData }: ComponentProps) {
    const { chat, assistants, userId } = loaderData;
    const { chatId } = useParams();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const revalidator = useRevalidator();

    const [selectedAssistantId, setSelectedAssistantId] = useState(
        chat?.assistantId || searchParams.get("assistant") || assistants[0]?.id || null
    );
    const selectedAssistant = assistants.find(a => a.id === selectedAssistantId) || assistants[0];

    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [streamingContent, setStreamingContent] = useState("");
    const [localMessages, setLocalMessages] = useState<MessageData[]>(chat?.messages || []);
    const [voiceMode, setVoiceMode] = useState(false);

    const { isSpeaking, speakingId, speak } = useSpeech();

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const scrollAreaRef = useRef<HTMLDivElement>(null);
    const voiceBaseRef = useRef("");

    // Update local messages when chat changes
    useEffect(() => {
        setLocalMessages(chat?.messages || []);
        if (chat?.assistantId) {
            setSelectedAssistantId(chat.assistantId);
        }
    }, [chat?.messages, chat?.assistantId]);

    // Scroll to bottom
    const scrollToBottom = useCallback(() => {
        if (scrollAreaRef.current) {
            const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
            if (scrollElement) {
                scrollElement.scrollTop = scrollElement.scrollHeight;
            }
        }
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [localMessages, streamingContent, scrollToBottom]);

    // Auto-resize textarea
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
        }
    }, [input]);

    const handleVoiceRecordingStart = () => {
        voiceBaseRef.current = input.trim();
    };

    const handleVoiceLiveChange = (recognized: string) => {
        const base = voiceBaseRef.current;
        setInput(base ? `${base} ${recognized}`.trim() : recognized);
    };

    const handleVoiceTranscript = (recognized: string) => {
        const base = voiceBaseRef.current;
        const full = base ? `${base} ${recognized}`.trim() : recognized;
        voiceBaseRef.current = "";

        if (voiceMode) {
            void handleSend(full);
            return;
        }

        setInput(full);
    };

    const handleSend = async (overrideContent?: string) => {
        const userMessageContent = (overrideContent ?? input).trim();
        if (!userMessageContent || isLoading || !selectedAssistant) return;

        if (!overrideContent) {
            setInput("");
            if (textareaRef.current) textareaRef.current.style.height = "auto";
        }

        // Optimistic update
        const tempUserMessage: MessageData = {
            id: `temp-${Date.now()}`,
            role: "user",
            content: userMessageContent,
            createdAt: new Date(),
        };
        setLocalMessages(prev => [...prev, tempUserMessage]);

        setIsLoading(true);
        setStreamingContent("");

        try {
            // Create chat or get existing chat ID
            let currentChatId = chatId;

            const createChat = async () => {
                const createResponse = await fetch("/api/user/chats", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        assistantId: selectedAssistant.id,
                        title: userMessageContent.slice(0, 50),
                    }),
                });

                if (!createResponse.ok) {
                    throw new Error("Failed to create chat");
                }

                const chatData = await createResponse.json();
                currentChatId = chatData.id;
                navigate(`/chat/${currentChatId}`, { replace: true });
            };

            if (!currentChatId) {
                await createChat();
            }

            // Send message and get streaming response
            let response = await fetch(`/api/chat/${currentChatId}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: userMessageContent,
                }),
            });

            if (response.status === 404) {
                await createChat();
                response = await fetch(`/api/chat/${currentChatId}`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        message: userMessageContent,
                    }),
                });
            }

            if (!response.ok) {
                throw new Error("Failed to send message");
            }

            const reader = response.body?.getReader();
            const decoder = new TextDecoder();
            let assistantContent = "";

            if (reader) {
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;
                    const text = decoder.decode(value, { stream: true });
                    assistantContent += text;
                    setStreamingContent(assistantContent);
                }
            }

            // Add assistant message to local state
            const assistantMessage: MessageData = {
                id: `temp-assistant-${Date.now()}`,
                role: "assistant",
                content: assistantContent || "Bir sorun oluştu.",
                createdAt: new Date(),
            };
            setLocalMessages(prev => [...prev, assistantMessage]);

            if (voiceMode && assistantContent) {
                void speak(assistantContent, assistantMessage.id);
            }

            // Revalidate to sync with server
            revalidator.revalidate();

        } catch (error) {
            console.error(error);
            const errorMessage: MessageData = {
                id: `temp-error-${Date.now()}`,
                role: "assistant",
                content: "Üzgünüm, bir hata oluştu. Lütfen tekrar deneyin.",
                createdAt: new Date(),
            };
            setLocalMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
            setStreamingContent("");
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    // No assistants available
    if (assistants.length === 0) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center p-4 max-w-2xl mx-auto w-full">
                <div className="mb-8 relative">
                    <div className="absolute -inset-4 bg-[#21c6cc]/10 rounded-full blur-2xl" />
                    <div className="relative w-20 h-20 bg-gradient-to-br from-[#8d36ff] to-[#21c6cc] rounded-2xl flex items-center justify-center shadow-xl shadow-cyan-500/25">
                        <Bot className="w-10 h-10 text-white" />
                    </div>
                </div>

                <h2 className="text-2xl font-bold mb-2 text-center">
                    Henüz Asistan Yok
                </h2>
                <p className="text-muted-foreground text-center mb-8 max-w-md">
                    Sohbet edebilmeniz için bir yöneticinin asistan oluşturması gerekiyor.
                </p>
            </div>
        );
    }

    // Empty state - no chat selected
    if (!chatId && localMessages.length === 0) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center p-4 max-w-2xl mx-auto w-full">
                <div className="mb-8 relative">
                    <div className="absolute -inset-4 bg-[#21c6cc]/10 rounded-full blur-2xl" />
                    <div className="relative w-20 h-20 bg-gradient-to-br from-[#8d36ff] to-[#21c6cc] rounded-2xl flex items-center justify-center shadow-xl shadow-cyan-500/25">
                        <Sparkles className="w-10 h-10 text-white" />
                    </div>
                </div>

                <h2 className="text-2xl font-bold mb-2 text-center">
                    Merhaba! Ben ArisAI
                </h2>
                <p className="text-muted-foreground text-center mb-8 max-w-md">
                    Size nasıl yardımcı olabilirim?
                </p>

                {/* Input Box with Assistant Selector */}
                <div className="w-full max-w-xl">
                    <div className="relative bg-card rounded-2xl border shadow-lg shadow-cyan-500/10 focus-within:ring-2 focus-within:ring-[#21c6cc]/20 focus-within:border-[#21c6cc] transition-all">
                        <Textarea
                            ref={textareaRef}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Mesajınızı yazın..."
                            className="min-h-[60px] max-h-[200px] w-full resize-none border-0 bg-transparent py-4 px-4 text-base focus-visible:ring-0 placeholder:text-muted-foreground/50"
                            rows={1}
                        />
                        <div className="flex justify-between items-center px-3 pb-3 gap-2">
                            {/* Assistant Selector Dropdown */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-8 gap-2 text-xs font-medium hover:bg-secondary"
                                    >
                                        <div
                                            className="w-5 h-5 rounded-md flex items-center justify-center"
                                            style={{ backgroundColor: selectedAssistant?.color + "20", color: selectedAssistant?.color }}
                                        >
                                            <Bot className="w-3 h-3" />
                                        </div>
                                        <span className="truncate max-w-[120px]">{selectedAssistant?.name || "Asistan Seç"}</span>
                                        <ChevronDown className="w-3 h-3 opacity-50" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="start" className="w-56">
                                    {assistants.map((assistant) => (
                                        <DropdownMenuItem
                                            key={assistant.id}
                                            onClick={() => setSelectedAssistantId(assistant.id)}
                                            className="gap-3 py-2"
                                        >
                                            <div
                                                className="w-6 h-6 rounded-md flex items-center justify-center shrink-0"
                                                style={{ backgroundColor: assistant.color + "20", color: assistant.color }}
                                            >
                                                <Bot className="w-4 h-4" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium truncate">{assistant.name}</p>
                                                {assistant.description && (
                                                    <p className="text-xs text-muted-foreground truncate">{assistant.description}</p>
                                                )}
                                            </div>
                                            {selectedAssistantId === assistant.id && (
                                                <Check className="w-4 h-4 text-[#21c6cc] shrink-0" />
                                            )}
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>

                            <div className="flex items-center gap-1">
                                <AutoSpeakToggle
                                    enabled={voiceMode}
                                    onToggle={() => setVoiceMode((prev) => !prev)}
                                    disabled={isLoading}
                                />
                                <VoiceInputButton
                                    onRecordingStart={handleVoiceRecordingStart}
                                    onLiveChange={handleVoiceLiveChange}
                                    onTranscript={handleVoiceTranscript}
                                    onError={(message) => toast.error(message)}
                                    disabled={isLoading}
                                    className="h-8 w-8 rounded-lg"
                                />
                                <Button
                                    onClick={() => handleSend()}
                                    disabled={!input.trim() || isLoading}
                                    size="icon"
                                    className={cn(
                                        "h-8 w-8 rounded-lg transition-all shrink-0",
                                        input.trim()
                                            ? "bg-gradient-to-r from-[#8d36ff] via-[#d84fd2] to-[#21c6cc] hover:brightness-110 text-white shadow-md shadow-cyan-500/25"
                                            : "bg-muted text-muted-foreground"
                                    )}
                                >
                                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <SendHorizontal className="w-4 h-4" />}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Suggestion chips */}
                <div className="flex flex-wrap justify-center gap-2 mt-6 max-w-lg">
                    {["Merhaba!", "Bugün nasılsın?", "Bana yardım eder misin?"].map((s) => (
                        <button
                            key={s}
                            onClick={() => setInput(s)}
                            className="px-4 py-2 text-sm bg-secondary hover:bg-secondary/80 rounded-full transition-colors"
                        >
                            {s}
                        </button>
                    ))}
                </div>
            </div>
        );
    }

    // Chat view with messages
    return (
        <div className="flex-1 flex flex-col h-full overflow-hidden">
            {/* Chat Header - Hidden on mobile */}
            <div className="hidden md:flex items-center justify-between p-4 border-b bg-background/80 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                    <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{
                            backgroundColor: (chat?.assistant?.color || selectedAssistant?.color || "#3B82F6") + "20",
                            color: chat?.assistant?.color || selectedAssistant?.color || "#3B82F6"
                        }}
                    >
                        <Bot className="w-5 h-5" />
                    </div>
                    <div>
                        <h2 className="font-semibold">{chat?.assistant?.name || selectedAssistant?.name || "ArisAI"}</h2>
                        <p className="text-xs text-muted-foreground">{chat?.title || "Yeni Sohbet"}</p>
                    </div>
                </div>
            </div>

            {/* Messages */}
            <ScrollArea ref={scrollAreaRef} className="flex-1 h-0 min-h-0">
                <div className="max-w-3xl mx-auto w-full px-4 py-6 space-y-6">
                    {localMessages.map((message) => (
                        <div
                            key={message.id}
                            className={cn(
                                "flex gap-3",
                                message.role === "user" ? "justify-end" : "justify-start"
                            )}
                        >
                            {message.role === "assistant" && (
                                <div
                                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                                    style={{
                                        backgroundColor: (chat?.assistant?.color || "#3B82F6") + "20",
                                        color: chat?.assistant?.color || "#3B82F6"
                                    }}
                                >
                                    <Bot className="w-5 h-5" />
                                </div>
                            )}

                            <div
                                className={cn(
                                    "max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed",
                                    message.role === "user"
                                        ? "bg-gradient-to-br from-[#8d36ff] to-[#21c6cc] text-white rounded-tr-sm whitespace-pre-wrap"
                                        : "bg-card border rounded-tl-sm"
                                )}
                            >
                                {message.role === "assistant" ? (
                                    <div className="space-y-2">
                                        <MarkdownRenderer content={message.content} />
                                        <div className="flex justify-end">
                                            <MessageSpeaker
                                                messageId={message.id}
                                                content={message.content}
                                                isActive={speakingId === message.id && isSpeaking}
                                                onSpeak={speak}
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    message.content
                                )}
                            </div>

                            {message.role === "user" && (
                                <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center shrink-0 text-sm">
                                    👤
                                </div>
                            )}
                        </div>
                    ))}

                    {/* Streaming message */}
                    {streamingContent && (
                        <div className="flex gap-3 justify-start">
                            <div
                                className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                                style={{
                                    backgroundColor: (chat?.assistant?.color || "#3B82F6") + "20",
                                    color: chat?.assistant?.color || "#3B82F6"
                                }}
                            >
                                <Bot className="w-5 h-5" />
                            </div>
                            <div className="max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed bg-card border rounded-tl-sm">
                                <MarkdownRenderer content={streamingContent} />
                                <span className="inline-block w-1 h-4 bg-[#21c6cc] ml-1 animate-pulse align-middle" />
                            </div>
                        </div>
                    )}

                    {/* Loading indicator */}
                    {isLoading && !streamingContent && (
                        <div className="flex gap-3 justify-start">
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-[#21c6cc]/10 text-[#21c6cc]">
                                <Bot className="w-5 h-5" />
                            </div>
                            <div className="flex items-center gap-2 p-4 rounded-xl bg-card border rounded-tl-sm">
                                <span className="flex gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#21c6cc] animate-bounce [animation-delay:-0.3s]" />
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#21c6cc] animate-bounce [animation-delay:-0.15s]" />
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#21c6cc] animate-bounce" />
                                </span>
                                <span className="text-xs text-muted-foreground">Yazıyor...</span>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} className="h-4 md:h-4 pb-20 md:pb-4" />
                </div>
            </ScrollArea>

            {/* Input Area - Sticky at bottom */}
            <div className="sticky bottom-0 left-0 right-0 p-3 md:p-4 bg-background/95 backdrop-blur-md border-t safe-area-bottom z-20">
                <div className="max-w-3xl mx-auto relative bg-card rounded-2xl border shadow-lg shadow-cyan-500/10 focus-within:ring-2 focus-within:ring-[#21c6cc]/20 focus-within:border-[#21c6cc] transition-all">
                    <Textarea
                        ref={textareaRef}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Mesajınızı yazın..."
                        className="min-h-[50px] max-h-[200px] w-full resize-none border-0 bg-transparent py-3 px-4 text-base focus-visible:ring-0 placeholder:text-muted-foreground/50"
                        rows={1}
                    />
                    <div className="flex justify-between items-center px-3 pb-3 gap-2">
                        {/* Assistant info (read-only in existing chat) */}
                        {chatId ? (
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <div
                                    className="w-5 h-5 rounded-md flex items-center justify-center"
                                    style={{ backgroundColor: (chat?.assistant?.color || "#3B82F6") + "20", color: chat?.assistant?.color || "#3B82F6" }}
                                >
                                    <Bot className="w-3 h-3" />
                                </div>
                                <span>{chat?.assistant?.name || "ArisAI"}</span>
                            </div>
                        ) : (
                            /* Assistant Selector for new chat */
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-8 gap-2 text-xs font-medium hover:bg-secondary"
                                    >
                                        <div
                                            className="w-5 h-5 rounded-md flex items-center justify-center"
                                            style={{ backgroundColor: selectedAssistant?.color + "20", color: selectedAssistant?.color }}
                                        >
                                            <Bot className="w-3 h-3" />
                                        </div>
                                        <span className="truncate max-w-[120px]">{selectedAssistant?.name}</span>
                                        <ChevronDown className="w-3 h-3 opacity-50" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="start" className="w-56">
                                    {assistants.map((assistant) => (
                                        <DropdownMenuItem
                                            key={assistant.id}
                                            onClick={() => setSelectedAssistantId(assistant.id)}
                                            className="gap-3 py-2"
                                        >
                                            <div
                                                className="w-6 h-6 rounded-md flex items-center justify-center shrink-0"
                                                style={{ backgroundColor: assistant.color + "20", color: assistant.color }}
                                            >
                                                <Bot className="w-4 h-4" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium truncate">{assistant.name}</p>
                                                {assistant.description && (
                                                    <p className="text-xs text-muted-foreground truncate">{assistant.description}</p>
                                                )}
                                            </div>
                                            {selectedAssistantId === assistant.id && (
                                                <Check className="w-4 h-4 text-[#21c6cc] shrink-0" />
                                            )}
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )}

                        <div className="flex items-center gap-1">
                            <AutoSpeakToggle
                                enabled={voiceMode}
                                onToggle={() => setVoiceMode((prev) => !prev)}
                                disabled={isLoading}
                            />
                            <VoiceInputButton
                                onRecordingStart={handleVoiceRecordingStart}
                                onLiveChange={handleVoiceLiveChange}
                                onTranscript={handleVoiceTranscript}
                                onError={(message) => toast.error(message)}
                                disabled={isLoading}
                            />
                            <Button
                                onClick={() => handleSend()}
                                disabled={!input.trim() || isLoading}
                                size="icon"
                                className={cn(
                                    "h-9 w-9 rounded-xl transition-all shrink-0",
                                    input.trim()
                                        ? "bg-gradient-to-r from-[#8d36ff] via-[#d84fd2] to-[#21c6cc] hover:brightness-110 text-white"
                                        : "bg-muted text-muted-foreground"
                                )}
                            >
                                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <SendHorizontal className="w-4 h-4" />}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
