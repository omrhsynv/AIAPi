import { getOpenAI } from "./openai.server";
import { synthesizeSpeechForVoice } from "./tts.server";
import {
    processTextTurn,
    createId,
    type RealtimeSessionRow,
} from "./realtime-session.server";
import type { AgentMessage } from "./agent-api.server";
import { emitTranslations } from "./realtime-translation.server";

/**
 * Realtime voice turn (Phase 3) — the server-side STT → RAG → ElevenLabs chain,
 * streamed over the WS protocol. This keeps ElevenLabs as the voice (per the
 * project decision) while giving the voice path the RAG that Aris888's own
 * voice path lacked: the transcript flows through `processTextTurn`, i.e. the
 * character's assistant + file_search knowledge base.
 *
 * Flow per turn:
 *   audio.chunk* (base64 PCM16 24kHz)  →  buffered here
 *   turn.commit                        →  WAV → Whisper STT → transcript.final
 *                                      →  processTextTurn (RAG) → response.final
 *                                      →  ElevenLabs → audio.tts.chunk* → response.completed
 *
 * Mock mode (REALTIME_VOICE_MOCK_MODE=true, or no OPENAI_API_KEY) skips the
 * external STT/TTS calls so the full protocol runs without provider spend.
 */

const TARGET_SAMPLE_RATE_HZ = Number(process.env.REALTIME_AUDIO_SAMPLE_RATE_HZ || 24000);
const TTS_CHUNK_BYTES = 16 * 1024;

export function isVoiceMockMode(): boolean {
    return (
        String(process.env.REALTIME_VOICE_MOCK_MODE || process.env.REALTIME_LOAD_TEST_MODE || "").toLowerCase() === "true" ||
        !process.env.OPENAI_API_KEY
    );
}

/** Wrap raw PCM16 mono samples in a minimal WAV container for Whisper. */
function pcm16ToWav(pcm: Buffer, sampleRate = TARGET_SAMPLE_RATE_HZ, channels = 1): Buffer {
    const byteRate = sampleRate * channels * 2;
    const blockAlign = channels * 2;
    const header = Buffer.alloc(44);
    header.write("RIFF", 0);
    header.writeUInt32LE(36 + pcm.length, 4);
    header.write("WAVE", 8);
    header.write("fmt ", 12);
    header.writeUInt32LE(16, 16);
    header.writeUInt16LE(1, 20); // PCM
    header.writeUInt16LE(channels, 22);
    header.writeUInt32LE(sampleRate, 24);
    header.writeUInt32LE(byteRate, 28);
    header.writeUInt16LE(blockAlign, 32);
    header.writeUInt16LE(16, 34); // bits per sample
    header.write("data", 36);
    header.writeUInt32LE(pcm.length, 40);
    return Buffer.concat([header, pcm]);
}

async function transcribePcm16(pcm: Buffer, sampleRate: number): Promise<string> {
    const wav = pcm16ToWav(pcm, sampleRate);
    const openai = getOpenAI();
    // Global File (Node 20+). Auto language detection (multilingual NPC).
    const file = new File([new Uint8Array(wav)], "turn.wav", { type: "audio/wav" });
    const result = await openai.audio.transcriptions.create({ file, model: "whisper-1" });
    return (result.text || "").trim();
}

function chunkText(text: string): string[] {
    const words = text.trim().split(/\s+/);
    if (words.length <= 2) return [text.trim()];
    const chunks: string[] = [];
    for (let i = 0; i < words.length; i += 3) chunks.push(words.slice(0, i + 3).join(" "));
    return chunks;
}

type SendFn = (type: string, payload: object) => void;

export class RealtimeVoiceTurnManager {
    private session: RealtimeSessionRow;
    private send: SendFn;
    private history: AgentMessage[];
    private voiceId?: string;
    private sampleRate: number;
    private frames: Buffer[] = [];
    private currentTurnId: string | null = null;
    private interrupted = false;
    private mock: boolean;
    private translationEnabled: boolean;
    private partyLocales: string[];

    constructor(opts: {
        session: RealtimeSessionRow;
        send: SendFn;
        history: AgentMessage[];
        voiceId?: string;
        sampleRate?: number;
        translationEnabled?: boolean;
        partyLocales?: string[];
    }) {
        this.session = opts.session;
        this.send = opts.send;
        this.history = opts.history;
        this.voiceId = opts.voiceId;
        this.sampleRate = opts.sampleRate || TARGET_SAMPLE_RATE_HZ;
        this.mock = isVoiceMockMode();
        this.translationEnabled = opts.translationEnabled === true;
        this.partyLocales = opts.partyLocales ?? [];
    }

    get mockMode(): boolean {
        return this.mock;
    }

    appendAudio(payload: { dataBase64?: string; turnId?: string }): void {
        if (!this.currentTurnId) {
            this.currentTurnId = payload.turnId || createId("turn");
            this.interrupted = false;
        }
        const b64 = String(payload.dataBase64 || "");
        if (b64) this.frames.push(Buffer.from(b64, "base64"));
    }

    interrupt(): void {
        this.interrupted = true;
        this.frames = [];
    }

    reset(): void {
        this.frames = [];
        this.currentTurnId = null;
        this.interrupted = false;
    }

    async commit(payload: { turnId?: string } = {}): Promise<void> {
        const turnId = payload.turnId || this.currentTurnId || createId("turn");
        this.currentTurnId = turnId;
        this.interrupted = false;
        const startedAt = Date.now();
        const pcm = this.frames.length ? Buffer.concat(this.frames) : Buffer.alloc(0);
        this.frames = [];

        try {
            // 1. Speech → text
            const transcript = this.mock
                ? "merhaba"
                : pcm.length > 0
                    ? await transcribePcm16(pcm, this.sampleRate)
                    : "";
            if (this.interrupted) return this.finishInterrupted(turnId);
            this.send("transcript.final", { turnId, text: transcript, locale: this.session.locale });

            if (!transcript) {
                this.send("response.final", { turnId, text: "" });
                this.send("session.metrics", { turnId, turnCompleteMs: Date.now() - startedAt, empty: true });
                this.reset();
                return;
            }

            // 2. Text → RAG answer (the character's assistant + knowledge base)
            const turn = await processTextTurn({ session: this.session, text: transcript, history: this.history, turnId });
            if (this.interrupted) return this.finishInterrupted(turnId);

            this.history.push({ role: "user", content: transcript });
            this.history.push({ role: "assistant", content: turn.text });
            if (this.history.length > 20) this.history = this.history.slice(-20);

            for (const chunk of chunkText(turn.text)) this.send("response.partial", { turnId, text: chunk });
            this.send("response.final", { turnId, text: turn.text });

            if (this.translationEnabled && turn.text) {
                // Fire-and-forget: subtitles/party translations must not delay TTS.
                emitTranslations({
                    send: this.send,
                    turnId,
                    text: turn.text,
                    orgId: this.session.orgId,
                    gameId: this.session.gameId,
                    playerLocale: this.session.locale,
                    partyLocales: this.partyLocales,
                }).catch(() => null);
            }

            // 3. Answer → ElevenLabs audio, streamed back as chunks
            const firstAudioAt = Date.now();
            const mp3 = this.mock
                ? Buffer.alloc(320) // tiny placeholder frame
                : (await synthesizeSpeechForVoice(turn.text, this.voiceId, this.session.locale)).audio;
            if (this.interrupted) return this.finishInterrupted(turnId);

            let sequence = 0;
            for (let offset = 0; offset < mp3.length; offset += TTS_CHUNK_BYTES) {
                if (this.interrupted) return this.finishInterrupted(turnId);
                const slice = mp3.subarray(offset, Math.min(offset + TTS_CHUNK_BYTES, mp3.length));
                sequence += 1;
                this.send("audio.tts.chunk", {
                    turnId,
                    sequence,
                    encoding: "mp3",
                    sampleRateHz: 44100,
                    dataBase64: slice.toString("base64"),
                    isFinal: offset + TTS_CHUNK_BYTES >= mp3.length,
                });
            }

            this.send("response.completed", { turnId });
            this.send("session.metrics", {
                turnId,
                turnCompleteMs: Date.now() - startedAt,
                utteranceEndToFirstAudioMs: firstAudioAt - startedAt,
                inputTokens: turn.inputTokens,
                outputTokens: turn.outputTokens,
                cached: turn.cached,
                degradedMode: this.mock ? "voice_mock" : null,
            });
            this.reset();
        } catch (error) {
            this.send("error", { code: (error as { code?: string }).code || "INTERNAL_ERROR", message: (error as Error).message, recoverable: true });
            this.reset();
        }
    }

    private finishInterrupted(turnId: string): void {
        this.send("moderation.event", { action: "interrupted", turnId });
        this.reset();
    }

    async destroy(): Promise<void> {
        this.reset();
    }
}
