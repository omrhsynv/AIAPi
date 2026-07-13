import { auth } from "~/lib/auth.server";
import { prisma } from "~/lib/db.server";
import { generateRawApiKey, hashApiKey } from "~/lib/agent-api.server";

async function isAdmin(request: Request): Promise<boolean> {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user?.id) return false;
    const user = await prisma.user.findUnique({
        where: { id: session.user.id as string },
        select: { role: true },
    });
    return user?.role === "admin";
}

// POST - Create a new API key linked to the selected assistants.
// Returns the raw key ONCE; only its hash is stored.
export async function action({ request }: { request: Request }) {
    if (!(await isAdmin(request))) {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (request.method !== "POST") {
        return Response.json({ error: "Method not allowed" }, { status: 405 });
    }

    const body = await request.json().catch(() => null);
    const name: string | null = body?.name?.trim() || null;
    const assistantIds: string[] = Array.isArray(body?.assistantIds)
        ? body.assistantIds.filter((v: unknown) => typeof v === "string")
        : [];

    if (assistantIds.length === 0) {
        return Response.json(
            { error: "En az bir asistan seçilmelidir" },
            { status: 400 },
        );
    }

    // Only connect assistants that actually exist.
    const valid = await prisma.assistant.findMany({
        where: { id: { in: assistantIds } },
        select: { id: true },
    });
    if (valid.length === 0) {
        return Response.json({ error: "Geçerli asistan bulunamadı" }, { status: 400 });
    }

    const rawKey = generateRawApiKey();
    const key = await prisma.apiKey.create({
        data: {
            name,
            keyHash: hashApiKey(rawKey),
            keyPrefix: rawKey.slice(0, 16),
            assistants: { connect: valid.map((a) => ({ id: a.id })) },
        },
        select: { id: true, name: true, keyPrefix: true, createdAt: true },
    });

    return Response.json({ ...key, rawKey });
}
