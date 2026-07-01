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

// GET - List all assistants (admin only)
export async function loader({ request }: { request: Request }) {
    if (!(await isAdmin(request))) {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const assistants = await prisma.assistant.findMany({
        include: {
            _count: { select: { chats: true, userAccess: true } },
        },
        orderBy: { createdAt: "desc" },
    });

    return Response.json(assistants);
}

// POST - Create new assistant
export async function action({ request }: { request: Request }) {
    if (!(await isAdmin(request))) {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (request.method !== "POST") {
        return Response.json({ error: "Method not allowed" }, { status: 405 });
    }

    const body = await request.json();
    const { name, description, systemInstruction, model, color, isPublic } = body;

    if (!name) {
        return Response.json({ error: "Name is required" }, { status: 400 });
    }

    const assistant = await prisma.assistant.create({
        data: {
            name,
            description: description || "",
            systemInstruction: systemInstruction || "Sen yardımcı bir asistansın.",
            model: model || "gpt-4.1-mini",
            color: color || "#3B82F6",
            icon: "bot",
            isPublic: isPublic !== false,
            isActive: true,
        },
    });

    return Response.json(assistant);
}
