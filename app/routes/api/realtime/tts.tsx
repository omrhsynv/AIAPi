import {
    verifyRealtimeSessionToken,
    extractBearerToken,
    type RealtimeAuthError,
} from "~/lib/realtime-token.server";
import { synthesizeSpeechForVoice } from "~/lib/tts.server";

/**
 * POST /api/realtime/tts — ElevenLabs TTS proxy for the NPC voice.
 *
 * Authorized by the session JWT (Bearer). The client sends `{ text }` and gets
 * back MP3 audio; the ElevenLabs API key stays server-side instead of being
 * embedded in the Unity build.
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
        return jsonError((e as RealtimeAuthError).message, 401);
    }

    let body: { text?: unknown; voiceId?: unknown; locale?: unknown };
    try {
        body = (await request.json()) as typeof body;
    } catch {
        return jsonError("Invalid JSON body", 400);
    }

    const text = String(body.text ?? "").trim();
    if (!text) {
        return jsonError("text is required", 400);
    }

    try {
        // Language decides which open-source model speaks; default to the
        // caller's own locale from their session token.
        const locale = String(body.locale ?? "").trim() || claims.locale;
        const { audio, cached, provider, voiceId, format } = await synthesizeSpeechForVoice(
            text,
            body.voiceId != null ? String(body.voiceId) : undefined,
            locale,
        );
        return new Response(new Uint8Array(audio), {
            headers: {
                "Content-Type": format === "wav" ? "audio/wav" : "audio/mpeg",
                "Cache-Control": "no-store",
                "X-Cache": cached ? "HIT" : "MISS",
                "X-Voice": voiceId,
                "X-Provider": provider,
                "X-Audio-Format": format,
            },
        });
    } catch (e) {
        console.error("realtime tts failed:", e);
        return jsonError((e as Error).message, 502);
    }
}

export function loader() {
    return jsonError("Method not allowed", 405);
}
