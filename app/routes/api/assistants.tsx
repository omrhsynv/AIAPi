import { auth } from "~/lib/auth.server";
import { prisma } from "~/lib/db.server";

// GET - List accessible assistants for user
export async function loader({ request }: { request: Request }) {
    const session = await auth.api.getSession({
        headers: request.headers,
    });

    if (!session?.user) {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id as string;
    const userRole = (session.user as any).role as string;

    let assistants;

    if (userRole === "admin") {
        // Admins see all active assistants
        assistants = await prisma.assistant.findMany({
            where: { isActive: true },
            select: {
                id: true,
                name: true,
                description: true,
                color: true,
                icon: true,
                isPublic: true,
            },
            orderBy: { name: "asc" },
        });
    } else {
        // Regular users see public or granted assistants
        assistants = await prisma.assistant.findMany({
            where: {
                isActive: true,
                OR: [
                    { isPublic: true },
                    { userAccess: { some: { userId } } },
                ],
            },
            select: {
                id: true,
                name: true,
                description: true,
                color: true,
                icon: true,
            },
            orderBy: { name: "asc" },
        });
    }

    return Response.json(assistants);
}
