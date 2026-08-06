import { prisma } from "~/lib/db.server";
import { extractApiKey, verifyApiKey } from "~/lib/agent-api.server";

/**
 * GET /api/agora/latest-response?channel=<channel>&after=<timestamp>
 *
 * Returns the latest assistant message for a given Agora channel from OUR
 * database (not Agora's history API). This guarantees the FULL, untruncated
 * GPT response because we save the complete text in `saveAgoraChat`.
 *
 * Query params:
 *   channel  — the Agora channel name (required)
 *   after    — ISO timestamp; only return messages created after this time (optional)
 *
 * Auth: Same API key as chat-completions (Bearer token or x-api-key).
 */
export async function loader({ request }: { request: Request }) {
    // --- Auth ---
    const rawKey = extractApiKey(request.headers);
    if (!rawKey) {
        return Response.json({ error: "Missing API key" }, { status: 401 });
    }
    const keyResult = await verifyApiKey(rawKey);
    if (!keyResult.ok) {
        return Response.json({ error: keyResult.error }, { status: keyResult.status });
    }

    // --- Parse query params ---
    const url = new URL(request.url);
    const channel = url.searchParams.get("channel")?.trim();
    if (!channel) {
        return Response.json({ error: "Missing 'channel' query parameter" }, { status: 400 });
    }

    const afterParam = url.searchParams.get("after");
    const afterDate = afterParam ? new Date(afterParam) : null;

    // --- Find the chat for this channel ---
    const chat = await prisma.chat.findFirst({
        where: { OR: [{ id: channel }, { title: channel }] },
    });

    if (!chat) {
        return Response.json({ content: null, timestamp: null });
    }

    // --- Get the latest assistant message ---
    const where: any = {
        chatId: chat.id,
        role: "assistant",
    };
    if (afterDate && !isNaN(afterDate.getTime())) {
        where.createdAt = { gt: afterDate };
    }

    const latestMessage = await prisma.message.findFirst({
        where,
        orderBy: { createdAt: "desc" },
        select: { content: true, createdAt: true },
    });

    if (!latestMessage) {
        return Response.json({ content: null, timestamp: null });
    }

    return Response.json({
        content: latestMessage.content,
        timestamp: latestMessage.createdAt.toISOString(),
    });
}
