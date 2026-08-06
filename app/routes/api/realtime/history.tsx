import {
    verifyRealtimeSessionToken,
    extractBearerToken,
    type RealtimeAuthError,
} from "~/lib/realtime-token.server";
import { getAgentHistory } from "~/lib/agora.server";

/**
 * GET /api/realtime/history?agentId=... — proxy Agora's Conversational AI
 * history. Authorized by the session JWT (Bearer). Keeps the Agora Customer
 * ID/Secret server-side; the Unity client used to call Agora directly with it.
 */

function jsonError(message: string, status: number): Response {
    return Response.json({ error: message }, { status });
}

export async function loader({ request }: { request: Request }) {
    try {
        verifyRealtimeSessionToken(extractBearerToken(request.headers));
    } catch (e) {
        return jsonError((e as RealtimeAuthError).message, 401);
    }

    const agentId = new URL(request.url).searchParams.get("agentId")?.trim();
    if (!agentId) {
        return jsonError("agentId query param is required", 400);
    }

    try {
        const raw = await getAgentHistory(agentId);
        return new Response(raw, {
            headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
        });
    } catch (e) {
        console.error("realtime history failed:", e);
        return jsonError((e as Error).message, 502);
    }
}
