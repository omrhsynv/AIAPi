import {
    verifyRealtimeSessionToken,
    extractBearerToken,
    type RealtimeAuthError,
} from "~/lib/realtime-token.server";
import { translateText } from "~/lib/realtime-translation.server";

/**
 * POST /api/realtime/translate — translate one line of player speech.
 *
 * Body: `{ text, sourceLocale?, targetLocale? }`. Auth: session JWT (Bearer).
 * `targetLocale` defaults to the caller's own locale from the token, which is
 * the normal case: each listener asks for the line in THEIR language.
 *
 * Results are cached (see realtime-cache.server), so when several players share
 * a language the same sentence is translated once and reused — and glossary
 * term locks keep game-specific names consistent.
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

    let body: { text?: unknown; sourceLocale?: unknown; targetLocale?: unknown };
    try {
        body = (await request.json()) as typeof body;
    } catch {
        return jsonError("Invalid JSON body", 400);
    }

    const text = String(body.text ?? "").trim();
    if (!text) return jsonError("text is required", 400);

    const targetLocale = String(body.targetLocale ?? "").trim() || claims.locale;
    const sourceLocale = String(body.sourceLocale ?? "").trim() || "";

    try {
        const translation = await translateText({
            text,
            sourceLocale,
            targetLocale,
            orgId: claims.orgId,
            gameId: claims.gameId,
        });
        return Response.json({
            text: translation.text,
            sourceLocale: translation.sourceLocale,
            targetLocale: translation.targetLocale,
            provider: translation.provider,
        });
    } catch (e) {
        console.error("realtime translate failed:", e);
        return jsonError((e as Error).message, 502);
    }
}

export function loader() {
    return jsonError("Method not allowed", 405);
}
