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

// GET - List all users (admin only)  
export async function loader({ request }: { request: Request }) {
    if (!(await isAdmin(request))) {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

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

    return Response.json(users);
}

// PUT - Update user role
export async function action({ request }: { request: Request }) {
    if (!(await isAdmin(request))) {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (request.method === "PUT") {
        const body = await request.json();
        const { userId, role } = body;

        if (!userId || !role) {
            return Response.json({ error: "User ID and role required" }, { status: 400 });
        }

        const user = await prisma.user.update({
            where: { id: userId },
            data: { role },
        });

        return Response.json(user);
    }

    return Response.json({ error: "Method not allowed" }, { status: 405 });
}
