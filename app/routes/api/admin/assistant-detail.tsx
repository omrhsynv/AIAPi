import { auth } from "~/lib/auth.server";
import { prisma } from "~/lib/db.server";

// Helper to check if user is admin
async function isAdmin(request: Request): Promise<boolean> {
    const session = await auth.api.getSession({
        headers: request.headers,
    });

    if (!session?.user?.id) return false;

    const user = await prisma.user.findUnique({
        where: { id: session.user.id as string },
        select: { role: true },
    });

    return user?.role === "admin";
}

// GET - Get single assistant details
export async function loader({ request, params }: { request: Request; params: { assistantId: string } }) {
    if (!(await isAdmin(request))) {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const assistant = await prisma.assistant.findUnique({
        where: { id: params.assistantId },
        include: {
            _count: { select: { chats: true, userAccess: true, vectorStoreFiles: true } },
        },
    });

    if (!assistant) {
        return Response.json({ error: "Assistant not found" }, { status: 404 });
    }

    return Response.json(assistant);
}

// PUT - Update assistant
// DELETE - Delete assistant
export async function action({ request, params }: { request: Request; params: { assistantId: string } }) {
    if (!(await isAdmin(request))) {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const assistantId = params.assistantId;

    if (request.method === "PUT") {
        const body = await request.json();
        const { name, description, systemInstruction, model, color, isPublic, isActive, vectorStoreId, vectorStoreName } = body;

        const assistant = await prisma.assistant.update({
            where: { id: assistantId },
            data: {
                name,
                description,
                systemInstruction,
                model,
                color,
                isPublic,
                isActive,
                vectorStoreId,
                vectorStoreName,
            },
        });

        return Response.json(assistant);
    }

    if (request.method === "DELETE") {
        await prisma.assistant.delete({
            where: { id: assistantId },
        });

        return Response.json({ success: true });
    }

    return Response.json({ error: "Method not allowed" }, { status: 405 });
}
