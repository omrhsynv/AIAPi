import { getOpenAI } from "./openai.server";
import { synthesizeElevenLabs } from "./elevenlabs.server";
import { lookupTts, storeTts } from "./realtime-cache.server";
import {
    resolveVoice,
    defaultVoiceId,
    isElevenLabsEnabled,
    type CatalogVoice,
    type PiperVariant,
} from "./voice-catalog.server";
import { isPiperEnabled, isPiperReady, synthesizePiper, pitchShiftWav } from "./piper.server";

/**
 * Unified text-to-speech.
 *
 * One entry point for every voice in the catalog; the provider is an
 * implementation detail resolved from the selected voice:
 *   - `openai`     — default. ~3x cheaper than ElevenLabs, multilingual, and the
 *                    `instructions` field gives each catalog entry its character.
 *   - `elevenlabs` — kept intact, selectable whenever ELEVENLABS_ENABLED=true.
 *
 * Audio is cached by (voice id + text), so a line that repeats across players
 * costs nothing the second time.
 */

const OPENAI_TTS_MODEL = process.env.OPENAI_TTS_MODEL || "gpt-4o-mini-tts";

export type SynthesisResult = {
    audio: Buffer;
    cached: boolean;
    provider: CatalogVoice["provider"];
    voiceId: string;
    /** Container of `audio`: Piper returns wav, the paid providers mp3. */
    format: "wav" | "mp3";
};

/**
 * Languages where the local models are not good enough, so synthesis falls
 * through to the cloud voice. Comma-separated, e.g. PIPER_SKIP_LANGUAGES=tr.
 */
function piperSkippedLanguages(): Set<string> {
    return new Set(
        String(process.env.PIPER_SKIP_LANGUAGES ?? "")
            .split(",")
            .map((s) => s.trim().toLowerCase())
            .filter(Boolean),
    );
}

/** Pick the open-source model for the language actually being spoken. */
function piperVariantFor(voice: CatalogVoice, locale: string | null | undefined): PiperVariant | null {
    if (!voice.piper) return null;
    const lang = String(locale ?? "").split("-")[0].toLowerCase();
    if (piperSkippedLanguages().has(lang)) return null;
    return voice.piper[lang] ?? voice.piper["*"] ?? null;
}

async function synthesizePiperVoice(variant: PiperVariant, text: string): Promise<Buffer> {
    // Pitch shifting resamples the audio, which also shortens it; slow the
    // synthesis by the same factor so the result keeps its natural duration.
    const pitch = variant.pitch ?? 1;
    const lengthScale = (variant.lengthScale ?? 1) * (pitch !== 1 ? pitch : 1);
    const wav = await synthesizePiper(text, {
        model: variant.model,
        speaker: variant.speaker,
        lengthScale,
    });
    return pitch !== 1 ? pitchShiftWav(wav, pitch) : wav;
}

async function synthesizeOpenAi(voice: CatalogVoice, text: string): Promise<Buffer> {
    const openai = getOpenAI();
    const response = await openai.audio.speech.create({
        model: OPENAI_TTS_MODEL,
        voice: voice.providerVoice as never,
        input: text.slice(0, 4000),
        response_format: "mp3",
        // Persona steering: what makes two entries on the same base voice differ.
        ...(voice.instructions ? { instructions: voice.instructions } : {}),
    } as never);
    return Buffer.from(await response.arrayBuffer());
}

/**
 * Synthesize `text` with the given catalog voice id.
 * Falls back to the default voice when the id is unknown, and to OpenAI when an
 * ElevenLabs voice is requested while ElevenLabs is disabled.
 */
export async function synthesizeSpeechForVoice(
    text: string,
    voiceId?: string | null,
    locale?: string | null,
): Promise<SynthesisResult> {
    const trimmed = String(text ?? "").trim();
    if (!trimmed) throw new Error("text is required");

    let voice = resolveVoice(voiceId) ?? resolveVoice(defaultVoiceId());
    if (!voice) throw new Error("No voice available");

    if (voice.provider === "elevenlabs" && !isElevenLabsEnabled()) {
        // Selected voice is turned off: fall back rather than fail the turn.
        voice = resolveVoice(defaultVoiceId()) ?? voice;
    }

    // Local open-source synthesis wins when it is installed and has a model for
    // this language. Cache separately per language, since a character uses a
    // different model per language.
    const variant = isPiperEnabled() ? piperVariantFor(voice, locale) : null;
    const usePiper = variant !== null && isPiperReady(variant.model);
    const cacheKey = usePiper ? `${voice.id}@${variant!.model}` : voice.id;

    const cached = await lookupTts(cacheKey, trimmed);
    if (cached) {
        return {
            audio: cached,
            cached: true,
            provider: usePiper ? "piper" : voice.provider,
            voiceId: voice.id,
            format: usePiper ? "wav" : "mp3",
        };
    }

    if (usePiper) {
        try {
            const audio = await synthesizePiperVoice(variant!, trimmed);
            storeTts(cacheKey, trimmed, audio).catch(() => null);
            return { audio, cached: false, provider: "piper", voiceId: voice.id, format: "wav" };
        } catch (error) {
            // Never lose the turn because a local model misbehaved.
            console.warn("Piper synthesis failed, falling back:", (error as Error).message);
        }
    }

    const audio =
        voice.provider === "elevenlabs"
            ? Buffer.from(await synthesizeElevenLabs(trimmed, { voiceId: voice.providerVoice }))
            : await synthesizeOpenAi(voice, trimmed);

    storeTts(voice.id, trimmed, audio).catch(() => null);
    return { audio, cached: false, provider: voice.provider, voiceId: voice.id, format: "mp3" };
}
