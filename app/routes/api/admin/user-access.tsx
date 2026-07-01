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

// GET - Get user access grants
export async function loader({ request, params }: { request: Request; params: { userId: string } }) {
    if (!(await isAdmin(request))) {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const accessGrants = await prisma.userAssistantAccess.findMany({
        where: { userId: params.userId },
        include: {
            assistant: {
                select: { id: true, name: true, color: true },
            },
        },
    });

    return Response.json(accessGrants);
}

// POST - Grant assistant access
// DELETE - Revoke assistant access
export async function action({ request, params }: { request: Request; params: { userId: string } }) {
    const session = await auth.api.getSession({
        headers: request.headers,
    });

    if (!(await isAdmin(request))) {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = params.userId;
    const adminId = session?.user?.id as string;

    if (request.method === "POST") {
        const body = await request.json();
        const { assistantId } = body;

        if (!assistantId) {
            return Response.json({ error: "Assistant ID required" }, { status: 400 });
        }

        const access = await prisma.userAssistantAccess.create({
            data: {
                userId,
                assistantId,
                grantedBy: adminId,
            },
        });

        return Response.json(access);
    }

    if (request.method === "DELETE") {
        const url = new URL(request.url);
        const assistantId = url.searchParams.get("assistantId");

        if (!assistantId) {
            return Response.json({ error: "Assistant ID required" }, { status: 400 });
        }

        await prisma.userAssistantAccess.deleteMany({
            where: { userId, assistantId },
        });

        return Response.json({ success: true });
    }

    return Response.json({ error: "Method not allowed" }, { status: 405 });
}
