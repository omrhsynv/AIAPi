import {
    verifyRealtimeSessionToken,
    extractBearerToken,
    type RealtimeAuthError,
} from "~/lib/realtime-token.server";
import { listVoices, defaultVoiceId } from "~/lib/voice-catalog.server";

/**
 * GET /api/realtime/voices — the selectable voices, for the in-game picker.
 * Auth: session JWT (Bearer). Provider details stay server-side; the client only
 * ever sees an id, a display name and a gender.
 */

export async function loader({ request }: { request: Request }) {
    try {
        verifyRealtimeSessionToken(extractBearerToken(request.headers));
    } catch (e) {
        return Response.json({ error: (e as RealtimeAuthError).message }, { status: 401 });
    }

    return Response.json({
        defaultVoiceId: defaultVoiceId(),
        voices: listVoices().map((v) => ({ id: v.id, name: v.name, gender: v.gender })),
    });
}
