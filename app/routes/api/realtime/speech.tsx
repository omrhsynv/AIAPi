import {
    verifyRealtimeSessionToken,
    extractBearerToken,
    type RealtimeAuthError,
} from "~/lib/realtime-token.server";
import { getOpenAI } from "~/lib/openai.server";

/**
 * POST /api/realtime/speech — speech-to-text for player-to-player translation.
 *
 * Body: raw WAV bytes (audio/wav). Auth: session JWT (Bearer).
 * Returns `{ text, language }`.
 *
 * The speaker's client sends their utterance here; the transcript is then
 * broadcast to the other players (over Photon), and each listener translates it
 * into their own language via /api/realtime/translate. Keeping STT server-side
 * means no provider key ships in the game client.
 */

function jsonError(message: string, status: number): Response {
    return Response.json({ error: message }, { status });
}

/**
 * Whisper's verbose response names languages in English ("turkish"), but the
 * rest of the pipeline speaks BCP-47. Without this, a Turkish listener would be
 * told the source is "turkish", fail the same-language check, and pay for a
 * pointless Turkish→Turkish translation.
 */
const WHISPER_LANGUAGE_CODES: Record<string, string> = {
    turkish: "tr", english: "en", russian: "ru", german: "de", french: "fr",
    spanish: "es", italian: "it", dutch: "nl", portuguese: "pt", arabic: "ar",
    japanese: "ja", korean: "ko", chinese: "zh", hindi: "hi", azerbaijani: "az",
};

function toLanguageCode(raw: string | undefined, fallback: string): string {
    const value = String(raw ?? "").trim().toLowerCase();
    if (!value) return fallback;
    if (WHISPER_LANGUAGE_CODES[value]) return WHISPER_LANGUAGE_CODES[value];
    // Already a code such as "tr" or "tr-TR".
    return value.length <= 5 ? value : fallback;
}

const MAX_AUDIO_BYTES = 8 * 1024 * 1024; // ~8 MB, plenty for a short utterance

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

    const bytes = await request.arrayBuffer();
    if (bytes.byteLength === 0) return jsonError("Empty audio body", 400);
    if (bytes.byteLength > MAX_AUDIO_BYTES) return jsonError("Audio too large", 413);

    try {
        const openai = getOpenAI();
        const file = new File([new Uint8Array(bytes)], "speech.wav", { type: "audio/wav" });
        // Let Whisper detect the language instead of forcing the speaker's
        // configured locale: pinning it made an English sentence get transcribed
        // as Turkish, which then looked "same language" to Turkish listeners and
        // skipped translation entirely. Detection is also the honest source
        // language to broadcast.
        const result = (await openai.audio.transcriptions.create({
            file,
            model: "whisper-1",
            response_format: "verbose_json",
        })) as unknown as { text?: string; language?: string };

        return Response.json({
            text: (result.text || "").trim(),
            language: toLanguageCode(result.language, claims.locale || ""),
        });
    } catch (e) {
        console.error("realtime speech STT failed:", e);
        return jsonError((e as Error).message, 502);
    }
}

export function loader() {
    return jsonError("Method not allowed", 405);
}
