/**
 * Voice catalog — the 20 selectable NPC/player voices (10 male, 10 female).
 *
 * Provider order, highest priority first:
 *   1. `piper`      — local, offline, open-source, free. Default when installed.
 *   2. `openai`     — paid fallback (~3x cheaper than ElevenLabs), multilingual.
 *   3. `elevenlabs` — kept intact, selectable when ELEVENLABS_ENABLED=true.
 *
 * Open-source models speak ONE language each, so a catalog entry is a character
 * *family*: `piper[lang]` picks the right model for the language actually being
 * spoken — the Turkish model for Turkish, the best English model for English.
 *
 * Turkish is the hard case: `tr_TR-dfki` is the only open Turkish voice and it
 * has a single speaker, so the 20 Turkish characters are separated by pitch
 * (deeper for male, higher for female). They are distinguishable rather than
 * twenty genuinely different actors — that limitation is the price of staying
 * free and offline. English uses libritts_r, which is multi-speaker, so there
 * the 20 characters really are 20 different voices.
 *
 * NOTE: the tr_TR-dfki model is CC BY-NC-SA (non-commercial). Check licensing
 * before shipping this commercially.
 */

export type VoiceProvider = "piper" | "openai" | "elevenlabs";

/**
 * Per-language Piper settings for one character.
 *
 * Open-source models are single-language, so a character is a *family*: the
 * Turkish model runs when the player speaks Turkish, the English model when they
 * speak English, and so on — "whichever is best for that language".
 *
 * `pitch` keeps a character recognisable across languages and, for Turkish,
 * is what separates the 20 characters at all: only ONE open Turkish voice
 * exists (tr_TR-dfki), so pitch is the identity knob. <1 = deeper, >1 = higher.
 */
export type PiperVariant = {
    model: string;
    speaker?: number;
    lengthScale?: number;
    pitch?: number;
};

/** language code -> Piper variant. "*" is the fallback for unlisted languages. */
export type PiperVoiceMap = Record<string, PiperVariant>;

// Swap the Turkish model without touching code: PIPER_TR_MODEL. `dfki` is the
// only one still published, but it was finetuned from a US-English voice, which
// is why its Turkish pronunciation is weak. `tr_TR-fettah-medium` is an
// alternative (pulled from the repo at its contributors' request — check before
// relying on it). If neither is good enough, exclude Turkish from Piper with
// PIPER_SKIP_LANGUAGES=tr and it falls back to the cloud voice.
const TR_MODEL = process.env.PIPER_TR_MODEL || "tr_TR-dfki-medium";
const EN_MODEL = "en_US-libritts_r-medium"; // multi-speaker: many distinct voices

/**
 * Build a character's per-language map: Turkish by pitch, English by speaker.
 *
 * Deliberately NO "*" catch-all. A Piper model only knows its own language, so
 * routing (say) Russian text to an English model produces gibberish. Languages
 * without a local model fall through to the multilingual cloud voice instead —
 * add one here (and to scripts/setup-piper.cjs) to make it local and free.
 */
function family(pitch: number, enSpeaker: number, lengthScale = 1): PiperVoiceMap {
    const map: PiperVoiceMap = {
        tr: { model: TR_MODEL, pitch, lengthScale },
        en: { model: EN_MODEL, speaker: enSpeaker, lengthScale },
    };
    // Optional extra languages, enabled per install once their model exists.
    if (process.env.PIPER_RU_MODEL) map.ru = { model: process.env.PIPER_RU_MODEL, pitch, lengthScale };
    if (process.env.PIPER_DE_MODEL) map.de = { model: process.env.PIPER_DE_MODEL, pitch, lengthScale };
    if (process.env.PIPER_FR_MODEL) map.fr = { model: process.env.PIPER_FR_MODEL, pitch, lengthScale };
    return map;
}

export type CatalogVoice = {
    /** Stable id sent by clients. Never reuse an id for a different voice. */
    id: string;
    /** Shown in the picker. */
    name: string;
    gender: "male" | "female";
    provider: VoiceProvider;
    /** OpenAI voice name, or the ElevenLabs voice id. */
    providerVoice: string;
    /** Persona steering (OpenAI only). */
    instructions?: string;
    /** Per-language open-source models. Used when Piper is enabled. */
    piper?: PiperVoiceMap;
};

const CALM = "Speak naturally and clearly, at a moderate pace.";

export const VOICE_CATALOG: CatalogVoice[] = [
    // ── Male (10) ────────────────────────────────────────────────────────────
    { id: "m1", name: "Deniz", gender: "male", provider: "openai", providerVoice: "onyx", instructions: `${CALM} Deep, warm and reassuring.`, piper: family(0.82, 10) },
    { id: "m2", name: "Kaan", gender: "male", provider: "openai", providerVoice: "ash", instructions: `${CALM} Young, friendly and upbeat.`, piper: family(0.9, 11) },
    { id: "m3", name: "Emre", gender: "male", provider: "openai", providerVoice: "echo", instructions: `${CALM} Neutral and professional, like a receptionist.`, piper: family(0.86, 12) },
    { id: "m4", name: "Barış", gender: "male", provider: "openai", providerVoice: "verse", instructions: `${CALM} Expressive and lively storyteller.`, piper: family(0.94, 13) },
    { id: "m5", name: "Mert", gender: "male", provider: "openai", providerVoice: "ballad", instructions: `${CALM} Soft-spoken and thoughtful.`, piper: family(0.88, 14) },
    { id: "m6", name: "Cedar", gender: "male", provider: "openai", providerVoice: "cedar", instructions: CALM, piper: family(0.84, 15) },
    { id: "m7", name: "Tarık", gender: "male", provider: "openai", providerVoice: "onyx", instructions: "Speak briskly and energetically, like an excited guide.", piper: family(0.96, 16) },
    { id: "m8", name: "Selim", gender: "male", provider: "openai", providerVoice: "ash", instructions: "Speak slowly and calmly, like an older, patient gentleman.", piper: family(0.8, 17) },
    { id: "m9", name: "Arda", gender: "male", provider: "openai", providerVoice: "echo", instructions: "Speak confidently and crisply, like a news presenter.", piper: family(0.92, 18) },
    { id: "m10", name: "Kerem", gender: "male", provider: "openai", providerVoice: "verse", instructions: "Speak in a relaxed, casual, conversational way.", piper: family(0.98, 19) },

    // ── Female (10) ──────────────────────────────────────────────────────────
    { id: "f1", name: "Elif", gender: "female", provider: "openai", providerVoice: "nova", instructions: `${CALM} Warm and welcoming.`, piper: family(1.14, 200) },
    { id: "f2", name: "Zeynep", gender: "female", provider: "openai", providerVoice: "coral", instructions: `${CALM} Bright, cheerful and helpful.`, piper: family(1.22, 201) },
    { id: "f3", name: "Aylin", gender: "female", provider: "openai", providerVoice: "shimmer", instructions: `${CALM} Gentle and soothing.`, piper: family(1.1, 202) },
    { id: "f4", name: "Nehir", gender: "female", provider: "openai", providerVoice: "sage", instructions: `${CALM} Calm, wise and measured.`, piper: family(1.18, 203) },
    { id: "f5", name: "Defne", gender: "female", provider: "openai", providerVoice: "alloy", instructions: `${CALM} Neutral and clear.`, piper: family(1.12, 204) },
    { id: "f6", name: "Marin", gender: "female", provider: "openai", providerVoice: "marin", instructions: CALM, piper: family(1.26, 205) },
    { id: "f7", name: "İpek", gender: "female", provider: "openai", providerVoice: "fable", instructions: `${CALM} Storybook narrator, softly expressive.`, piper: family(1.16, 206) },
    { id: "f8", name: "Selin", gender: "female", provider: "openai", providerVoice: "nova", instructions: "Speak quickly and enthusiastically, like an excited young guide.", piper: family(1.3, 207) },
    { id: "f9", name: "Melis", gender: "female", provider: "openai", providerVoice: "coral", instructions: "Speak slowly and warmly, like a patient teacher.", piper: family(1.08, 208) },
    { id: "f10", name: "Ceren", gender: "female", provider: "openai", providerVoice: "shimmer", instructions: "Speak confidently and professionally, like a presenter.", piper: family(1.2, 209) },
];

/** The configured ElevenLabs voice, offered only when ElevenLabs is enabled. */
export function elevenLabsVoice(): CatalogVoice | null {
    if (!isElevenLabsEnabled()) return null;
    const providerVoice = (process.env.ELEVENLABS_VOICE_ID || "").trim();
    if (!providerVoice) return null;
    return {
        id: "el1",
        name: process.env.ELEVENLABS_VOICE_NAME?.trim() || "ElevenLabs",
        gender: (process.env.ELEVENLABS_VOICE_GENDER === "male" ? "male" : "female"),
        provider: "elevenlabs",
        providerVoice,
    };
}

export function isElevenLabsEnabled(): boolean {
    // Kept available but off by default: it is the expensive path.
    return String(process.env.ELEVENLABS_ENABLED ?? "false").toLowerCase() === "true";
}

/** Default voice id when the client doesn't pick one. */
export function defaultVoiceId(): string {
    const configured = (process.env.REALTIME_DEFAULT_VOICE || "").trim();
    if (configured && resolveVoice(configured)) return configured;
    return "f1";
}

/** All voices a client may choose from. */
export function listVoices(): CatalogVoice[] {
    const extra = elevenLabsVoice();
    return extra ? [...VOICE_CATALOG, extra] : VOICE_CATALOG;
}

/**
 * Resolve a voice id. Also accepts a raw provider voice name (e.g. "nova") and
 * legacy ElevenLabs voice ids, so older clients keep working.
 */
export function resolveVoice(voiceId: string | null | undefined): CatalogVoice | null {
    const id = String(voiceId ?? "").trim();
    if (!id) return null;

    const byId = listVoices().find((v) => v.id === id);
    if (byId) return byId;

    const byProviderName = VOICE_CATALOG.find((v) => v.providerVoice === id && v.provider === "openai");
    if (byProviderName) return byProviderName;

    // Unknown id that looks like an ElevenLabs voice: honour it if enabled.
    if (isElevenLabsEnabled() && id.length >= 16) {
        return { id, name: "Custom", gender: "female", provider: "elevenlabs", providerVoice: id };
    }
    return null;
}
