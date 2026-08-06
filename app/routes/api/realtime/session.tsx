import { timingSafeEqual } from "node:crypto";
import { signRealtimeSessionToken } from "~/lib/realtime-token.server";
import { buildRtcToken, getAgoraAppId } from "~/lib/agora.server";

/**
 * POST /api/realtime/session — mint an ephemeral NPC session for a game client.
 *
 * Auth: a trusted caller proves itself with `X-Realtime-Service-Key`
 * (== REALTIME_GAME_SERVER_API_KEY). This key must live on a trusted server
 * (your game backend or this platform) and NEVER in the shipped game client.
 *
 * Returns a short-lived session JWT plus everything the client needs to join
 * the Agora channel as a publisher — an RTC token generated here from the App
 * Certificate. The client holds no long-lived secret afterwards.
 */

function jsonError(message: string, status: number): Response {
    return Response.json({ error: message }, { status });
}

function safeEqual(a: string, b: string): boolean {
    const ab = Buffer.from(a);
    const bb = Buffer.from(b);
    if (ab.length !== bb.length) return false;
    return timingSafeEqual(ab, bb);
}

function sanitizeChannel(raw: string, fallback: string): string {
    // Agora channel names: letters, digits, and a limited punctuation set, <= 64 chars.
    const cleaned = raw.replace(/[^a-zA-Z0-9!#$%&()+\-:;<=>.?@[\]^_{}|~]/g, "-").slice(0, 64);
    // Never fall back to a shared constant: every player must land in their OWN
    // channel, otherwise they join each other's NPC conversation and hear each
    // other over RTC.
    return cleaned || fallback;
}

export async function action({ request }: { request: Request }) {
    if (request.method !== "POST") {
        return jsonError("Method not allowed", 405);
    }

    const serviceKey = process.env.REALTIME_GAME_SERVER_API_KEY?.trim();
    if (!serviceKey) {
        return jsonError("Realtime session minting is not configured", 503);
    }

    const provided = request.headers.get("x-realtime-service-key")?.trim() || "";
    if (!provided || !safeEqual(provided, serviceKey)) {
        return jsonError("Invalid or missing service key", 401);
    }

    let body: Record<string, unknown>;
    try {
        body = (await request.json()) as Record<string, unknown>;
    } catch {
        return jsonError("Invalid JSON body", 400);
    }

    const characterId = String(body.characterId ?? "").trim();
    const playerId = String(body.playerId ?? "").trim();
    if (!characterId || !playerId) {
        return jsonError("characterId and playerId are required", 400);
    }

    const orgId = String(body.orgId ?? process.env.REALTIME_DEFAULT_ORG_ID ?? "org-aris888").trim();
    const gameId = String(body.gameId ?? process.env.REALTIME_DEFAULT_GAME_ID ?? "game-metaverse").trim();
    const locale = String(body.locale ?? "tr-TR").trim() || "tr-TR";
    const ttlSeconds = body.ttlSeconds != null ? Number(body.ttlSeconds) : undefined;

    let appId: string;
    try {
        appId = getAgoraAppId();
    } catch (e) {
        return jsonError((e as Error).message, 503);
    }

    // NOTE: Unity's JsonUtility serializes an unset string as "" rather than
    // omitting it, so `??` alone would accept the empty value and every player
    // would end up in the same channel. Treat empty as "not supplied".
    const perPlayerChannel = `npc-${gameId}-${playerId}`;
    const requestedChannel = String(body.channel ?? "").trim();
    const channel = sanitizeChannel(requestedChannel || perPlayerChannel, perPlayerChannel);
    // A stable-ish publisher uid for this player. Clients may pass their own.
    const rtcUid = Number.isInteger(Number(body.rtcUid)) && Number(body.rtcUid) > 0
        ? Number(body.rtcUid)
        : 1000 + Math.floor(Math.random() * 89_999_999);

    let minted;
    try {
        minted = signRealtimeSessionToken({ orgId, gameId, characterId, playerId, locale, ttlSeconds });
    } catch (e) {
        return jsonError((e as Error).message, 400);
    }

    let rtcToken: string;
    try {
        rtcToken = buildRtcToken({
            channel,
            uid: rtcUid,
            role: "publisher",
            expireSeconds: minted.claims.ttlSeconds,
        });
    } catch (e) {
        return jsonError((e as Error).message, 503);
    }

    return Response.json({
        token: minted.token,
        tokenType: minted.tokenType,
        expiresAt: minted.expiresAt,
        session: {
            orgId,
            gameId,
            characterId,
            playerId,
            locale,
            appId,
            channel,
            rtcUid,
            rtcToken,
            ttlSeconds: minted.claims.ttlSeconds,
        },
    });
}

export function loader() {
    return jsonError("Method not allowed", 405);
}
