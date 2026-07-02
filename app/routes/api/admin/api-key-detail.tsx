import { auth } from "~/lib/auth.server";
import { prisma } from "~/lib/db.server";
import { invalidateKeyCache } from "~/lib/agent-api.server";

async function isAdmin(request: Request): Promise<boolean> {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user?.id) return false;
    const user = await prisma.user.findUnique({
        where: { id: session.user.id as string },
        select: { role: true },
    });
    return user?.role === "admin";
}

// PATCH  - revoke/unrevoke and/or update permitted assistants
// DELETE - delete the key
export async function action({
    request,
    params,
}: {
    request: Request;
    params: { keyId: string };
}) {
    if (!(await isAdmin(request))) {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const keyId = params.keyId;

    if (request.method === "PATCH") {
        const body = await request.json().catch(() => null);
        const data: { revoked?: boolean; assistants?: { set: { id: string }[] } } = {};

        if (typeof body?.revoked === "boolean") {
            data.revoked = body.revoked;
        }
        if (Array.isArray(body?.assistantIds)) {
            const ids: string[] = body.assistantIds.filter((v: unknown) => typeof v === "string");
            data.assistants = { set: ids.map((id) => ({ id })) };
        }

        if (Object.keys(data).length === 0) {
            return Response.json({ error: "Değişiklik yok" }, { status: 400 });
        }

        await prisma.apiKey.update({ where: { id: keyId }, data });
        invalidateKeyCache(); // apply revoke/permission changes immediately
        return Response.json({ success: true });
    }

    if (request.method === "DELETE") {
        await prisma.apiKey.delete({ where: { id: keyId } });
        invalidateKeyCache();
        return Response.json({ success: true });
    }

    return Response.json({ error: "Method not allowed" }, { status: 405 });
}
