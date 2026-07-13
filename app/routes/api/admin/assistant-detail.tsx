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
        const { name, slug, description, systemInstruction, model, color, isPublic, isActive, vectorStoreId, vectorStoreName } = body;

        // Normalize the API slug: lowercase, spaces/underscores -> dash, drop
        // anything that isn't a-z0-9-. Empty becomes null (falls back to id).
        let normalizedSlug: string | null | undefined = undefined;
        if (slug !== undefined) {
            const cleaned = String(slug)
                .trim()
                .toLowerCase()
                .replace(/[\s_]+/g, "-")
                .replace(/[^a-z0-9-]/g, "")
                .replace(/-+/g, "-")
                .replace(/^-|-$/g, "");
            normalizedSlug = cleaned || null;
        }

        try {
            const assistant = await prisma.assistant.update({
                where: { id: assistantId },
                data: {
                    name,
                    slug: normalizedSlug,
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
        } catch (error: any) {
            // Unique constraint on slug
            if (error?.code === "P2002") {
                return Response.json({ error: "Bu slug zaten kullanımda" }, { status: 409 });
            }
            throw error;
        }
    }

    if (request.method === "DELETE") {
        await prisma.assistant.delete({
            where: { id: assistantId },
        });

        return Response.json({ success: true });
    }

    return Response.json({ error: "Method not allowed" }, { status: 405 });
}
