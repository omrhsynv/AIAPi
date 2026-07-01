import { auth } from "~/lib/auth.server";
import { prisma } from "~/lib/db.server";
import { chatStream } from "~/lib/openai.server";

export async function action({ request, params }: { request: Request; params: { chatId: string } }) {
    const session = await auth.api.getSession({
        headers: request.headers,
    });

    if (!session?.user) {
        return new Response("Unauthorized", { status: 401 });
    }

    const userId = session.user.id as string;
    const chatId = params.chatId;

    // Get chat and verify ownership
    const chat = await prisma.chat.findFirst({
        where: { id: chatId, userId },
        include: {
            assistant: true,
            messages: {
                orderBy: { createdAt: "asc" },
                take: 50, // Last 50 messages for context
            },
        },
    });

    if (!chat) {
        return new Response("Chat not found", { status: 404 });
    }

    const body = await request.json();
    const { message } = body;

    if (!message) {
        return new Response("Message required", { status: 400 });
    }

    // Save user message to database
    await prisma.message.create({
        data: {
            chatId,
            role: "user",
            content: message,
        },
    });

    // Update chat title if first message
    if (chat.messages.length === 0) {
        await prisma.chat.update({
            where: { id: chatId },
            data: { title: message.slice(0, 50) },
        });
    }

    // Build conversation history
    const conversationHistory = chat.messages.map((msg) => ({
        role: msg.role as "user" | "assistant",
        content: msg.content,
    }));

    // Add current message
    conversationHistory.push({ role: "user", content: message });

    // Get streaming response
    try {
        const stream = await chatStream(
            conversationHistory,
            chat.assistant.systemInstruction,
            chat.assistant.vectorStoreId || undefined,
            chat.assistant.model
        );

        // Collect full response for saving
        let fullResponse = "";

        // Create a transform stream to collect the response
        const transformStream = new TransformStream({
            transform(chunk, controller) {
                const text = new TextDecoder().decode(chunk);
                fullResponse += text;
                controller.enqueue(chunk);
            },
            async flush() {
                // Save assistant message to database after streaming completes
                if (fullResponse.trim()) {
                    await prisma.message.create({
                        data: {
                            chatId,
                            role: "assistant",
                            content: fullResponse,
                        },
                    });

                    // Update chat updatedAt
                    await prisma.chat.update({
                        where: { id: chatId },
                        data: { updatedAt: new Date() },
                    });
                }
            },
        });

        return new Response(stream.pipeThrough(transformStream), {
            headers: {
                "Content-Type": "text/plain; charset=utf-8",
                "Transfer-Encoding": "chunked",
                "Cache-Control": "no-cache",
            },
        });
    } catch (error) {
        console.error("Chat error:", error);
        return new Response("Internal server error", { status: 500 });
    }
}
