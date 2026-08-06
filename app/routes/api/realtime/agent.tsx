import {
    verifyRealtimeSessionToken,
    assertClaimBinding,
    extractBearerToken,
    type RealtimeAuthError,
} from "~/lib/realtime-token.server";
import {
    buildRtcToken,
    startConversationalAgent,
    stopConversationalAgent,
} from "~/lib/agora.server";

/**
 * POST /api/realtime/agent — start or stop the Agora Conversational AI agent for
 * a session. Authorized by the session JWT (Bearer). The Agora Customer
 * ID/Secret and the custom-LLM Agent API key stay server-side; the client only
 * says "start on this channel with this character" and gets back an agentId.
 */

function jsonError(message: string, status: number): Response {
    return Response.json({ error: message }, { status });
}

export async function action({ request }: { request: Request }) {
    if (request.method !== "POST") {
        return jsonError("Method not allowed", 405);
    }

    let claims;
    try {
        claims = verifyRealtimeSessionToken(extractBearerToken(request.headers));
    } catch (e) {
        const err = e as RealtimeAuthError;
        return jsonError(err.message, 401);
    }

    let body: Record<string, unknown>;
    try {
        body = (await request.json()) as Record<string, unknown>;
    } catch {
        return jsonError("Invalid JSON body", 400);
    }

    // Bind the token to the character/player it claims to act for.
    try {
        assertClaimBinding(claims, {
            characterId: body.characterId != null ? String(body.characterId) : undefined,
            playerId: body.playerId != null ? String(body.playerId) : undefined,
        });
    } catch (e) {
        return jsonError((e as RealtimeAuthError).message, 403);
    }

    const op = String(body.action ?? "start").trim();

    if (op === "stop") {
        const agentId = String(body.agentId ?? "").trim();
        if (!agentId) return jsonError("agentId is required to stop", 400);
        try {
            await stopConversationalAgent(agentId);
            return Response.json({ ok: true });
        } catch (e) {
            console.error("realtime agent stop failed:", e);
            return jsonError((e as Error).message, 502);
        }
    }

    if (op !== "start") {
        return jsonError(`Unsupported action: ${op}`, 400);
    }

    const channel = String(body.channel ?? "").trim();
    const remoteRtcUid = String(body.remoteRtcUid ?? "").trim();
    if (!channel || !remoteRtcUid) {
        return jsonError("channel and remoteRtcUid are required to start", 400);
    }

    const agentRtcUid = String(body.agentRtcUid ?? "2002").trim();
    const model = body.model != null ? String(body.model).trim() : undefined;

    try {
        // The agent needs its own publisher RTC token, generated server-side.
        const agentRtcToken = buildRtcToken({
            channel,
            uid: Number(agentRtcUid) || 2002,
            role: "publisher",
            expireSeconds: claims.ttlSeconds,
        });

        const { agentId } = await startConversationalAgent({
            channel,
            agentRtcUid,
            agentRtcToken,
            remoteRtcUid,
            model,
            namePrefix: `npc-${claims.characterId}`,
            // This player's language, from their signed session token. Drives ASR
            // and the reply language, so a mixed-language room works.
            locale: claims.locale,
            // Empty/missing => follow the player's locale (see startConversationalAgent).
            asrLanguage: String(body.asrLanguage ?? "").trim() || undefined,
        });

        return Response.json({ ok: true, agentId });
    } catch (e) {
        console.error("realtime agent start failed:", e);
        return jsonError((e as Error).message, 502);
    }
}

export function loader() {
    return jsonError("Method not allowed", 405);
}
