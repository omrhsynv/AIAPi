/**
 * ElevenLabs TTS — server-side proxy so the API key stops shipping inside the
 * Unity build. The client sends text (over an authenticated realtime request)
 * and gets back MP3 audio; the key never leaves the server.
 */

import { lookupTts, storeTts } from "./realtime-cache.server";

/**
 * Cache-aware synthesis: identical answer text (same voice) reuses stored audio
 * instead of paying ElevenLabs again — the multiplayer win when many players get
 * the same cached answer. Returns whether the audio came from cache.
 */
export async function synthesizeElevenLabsCached(
    text: string,
    opts: { voiceId?: string; modelId?: string } = {},
): Promise<{ audio: Buffer; cached: boolean }> {
    const voiceId = (opts.voiceId || process.env.ELEVENLABS_VOICE_ID || "").trim();
    const cachedAudio = voiceId ? await lookupTts(voiceId, text) : null;
    if (cachedAudio) return { audio: cachedAudio, cached: true };

    const fresh = Buffer.from(await synthesizeElevenLabs(text, { ...opts, voiceId }));
    if (voiceId) storeTts(voiceId, text, fresh).catch(() => null);
    return { audio: fresh, cached: false };
}

export async function synthesizeElevenLabs(
    text: string,
    opts: { voiceId?: string; modelId?: string } = {},
): Promise<ArrayBuffer> {
    const apiKey = process.env.ELEVENLABS_API_KEY?.trim();
    if (!apiKey) {
        throw new Error("Missing ELEVENLABS_API_KEY");
    }

    const voiceId = (opts.voiceId || process.env.ELEVENLABS_VOICE_ID || "").trim();
    if (!voiceId) {
        throw new Error("Missing ELEVENLABS_VOICE_ID");
    }
    const modelId = (opts.modelId || process.env.ELEVENLABS_MODEL_ID || "eleven_multilingual_v2").trim();

    const url = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}?output_format=mp3_44100_128`;
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "xi-api-key": apiKey,
            "Content-Type": "application/json",
            accept: "audio/mpeg",
        },
        body: JSON.stringify({
            text: text.slice(0, 5000),
            model_id: modelId,
            voice_settings: { stability: 0.5, similarity_boost: 0.75 },
        }),
    });

    if (!response.ok) {
        const detail = await response.text().catch(() => "");
        throw new Error(`ElevenLabs TTS failed: ${response.status} ${detail.slice(0, 200)}`);
    }

    return response.arrayBuffer();
}
