import { auth } from "~/lib/auth.server";
import { prisma } from "~/lib/db.server";

// GET - List user's chats
export async function loader({ request }: { request: Request }) {
    const session = await auth.api.getSession({
        headers: request.headers,
    });

    if (!session?.user) {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id as string;

    const chats = await prisma.chat.findMany({
        where: { userId },
        select: {
            id: true,
            title: true,
            assistantId: true,
            updatedAt: true,
            assistant: {
                select: { name: true, color: true },
            },
        },
        orderBy: { updatedAt: "desc" },
    });

    return Response.json(chats);
}

// POST - Create new chat
// DELETE - Delete a chat
export async function action({ request }: { request: Request }) {
    const session = await auth.api.getSession({
        headers: request.headers,
    });

    if (!session?.user) {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id as string;

    if (request.method === "POST") {
        const body = await request.json();
        const { assistantId, title } = body;

        if (!assistantId) {
            return Response.json({ error: "Assistant ID required" }, { status: 400 });
        }

        // Verify user has access to this assistant
        const userRole = (session.user as any).role as string;
        let hasAccess = false;

        if (userRole === "admin") {
            hasAccess = true;
        } else {
            const assistant = await prisma.assistant.findFirst({
                where: {
                    id: assistantId,
                    isActive: true,
                    OR: [
                        { isPublic: true },
                        { userAccess: { some: { userId } } },
                    ],
                },
            });
            hasAccess = !!assistant;
        }

        if (!hasAccess) {
            return Response.json({ error: "No access to this assistant" }, { status: 403 });
        }

        const chat = await prisma.chat.create({
            data: {
                userId,
                assistantId,
                title: title || "Yeni Sohbet",
            },
        });

        return Response.json(chat);
    }

    if (request.method === "DELETE") {
        const url = new URL(request.url);
        const chatId = url.searchParams.get("chatId");

        if (!chatId) {
            return Response.json({ error: "Chat ID required" }, { status: 400 });
        }

        // Verify ownership
        const chat = await prisma.chat.findFirst({
            where: { id: chatId, userId },
        });

        if (!chat) {
            return Response.json({ error: "Chat not found" }, { status: 404 });
        }

        await prisma.chat.delete({
            where: { id: chatId },
        });

        return Response.json({ success: true });
    }

    return Response.json({ error: "Method not allowed" }, { status: 405 });
}
