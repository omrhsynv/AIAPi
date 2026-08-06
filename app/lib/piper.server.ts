import { spawn } from "node:child_process";
import { existsSync, readFileSync, unlinkSync, mkdirSync } from "node:fs";
import { randomUUID } from "node:crypto";
import os from "node:os";
import path from "node:path";

/**
 * Piper TTS — fully local, offline, open-source speech synthesis.
 *
 * No API, no per-character billing: a small ONNX model runs on the CPU at
 * roughly 10x realtime. Each Piper model speaks ONE language, so a "voice" here
 * is a character that maps to a different model per language (see
 * voice-catalog.server.ts) — exactly the per-language routing this project
 * wants.
 *
 * Piper outputs 16-bit PCM WAV on stdout, which is what we hand back.
 *
 * Install with `npm run piper:setup` (downloads the binary + voice models into
 * PIPER_DIR). When Piper is not installed the TTS layer falls back to another
 * provider rather than failing.
 */

const PIPER_DIR = process.env.PIPER_DIR || path.join(process.cwd(), "piper");
const PIPER_TIMEOUT_MS = Number(process.env.PIPER_TIMEOUT_MS || 20_000);

export function isPiperEnabled(): boolean {
    return String(process.env.PIPER_ENABLED ?? "false").toLowerCase() === "true";
}

/** Path to the piper executable, or null when it isn't installed. */
export function findPiperBinary(): string | null {
    const configured = process.env.PIPER_BINARY?.trim();
    if (configured && existsSync(configured)) return configured;

    const candidates = [
        path.join(PIPER_DIR, "piper.exe"),
        path.join(PIPER_DIR, "piper", "piper.exe"),
        path.join(PIPER_DIR, "piper"),
        path.join(PIPER_DIR, "piper", "piper"),
    ];
    return candidates.find((p) => existsSync(p)) ?? null;
}

/** Absolute path to a voice model file, or null when it isn't downloaded. */
export function findPiperModel(modelName: string): string | null {
    const file = modelName.endsWith(".onnx") ? modelName : `${modelName}.onnx`;
    const candidates = [
        path.join(PIPER_DIR, "voices", file),
        path.join(PIPER_DIR, file),
    ];
    return candidates.find((p) => existsSync(p)) ?? null;
}

export function isPiperReady(modelName?: string): boolean {
    if (!isPiperEnabled()) return false;
    if (!findPiperBinary()) return false;
    return modelName ? findPiperModel(modelName) !== null : true;
}

export type PiperOptions = {
    /** Model file name, e.g. "tr_TR-dfki-medium". */
    model: string;
    /** Speaker index for multi-speaker models (libritts_r has hundreds). */
    speaker?: number;
    /** >1 speaks slower, <1 faster. Piper's `length_scale`. */
    lengthScale?: number;
};

/**
 * Run Piper and return the WAV bytes.
 *
 * Writes to a temp FILE rather than reading stdout: on Windows, piper's stdout
 * is in text mode, so every 0x0A byte of PCM audio is expanded to 0x0D 0x0A.
 * That inflates the stream (measured: +710 bytes on a 2.5 s clip), shifts every
 * sample after the first newline byte, and the result plays as pure noise. The
 * file path is byte-exact.
 */
export function synthesizePiper(text: string, opts: PiperOptions): Promise<Buffer> {
    const binary = findPiperBinary();
    if (!binary) return Promise.reject(new Error("Piper binary not found (run `npm run piper:setup`)"));

    const model = findPiperModel(opts.model);
    if (!model) return Promise.reject(new Error(`Piper model not found: ${opts.model}`));

    const outDir = path.join(os.tmpdir(), "aiapi-piper");
    try {
        mkdirSync(outDir, { recursive: true });
    } catch {
        /* already there */
    }
    // Unique per call: several players may synthesize at the same time.
    const outFile = path.join(outDir, `${randomUUID()}.wav`);

    const args = ["--model", model, "--output_file", outFile];
    if (typeof opts.speaker === "number") args.push("--speaker", String(opts.speaker));
    if (typeof opts.lengthScale === "number") args.push("--length_scale", String(opts.lengthScale));

    return new Promise<Buffer>((resolve, reject) => {
        const proc = spawn(binary, args, { cwd: path.dirname(binary) });
        let stderr = "";

        const cleanup = () => {
            try {
                unlinkSync(outFile);
            } catch {
                /* nothing to remove */
            }
        };

        const timer = setTimeout(() => {
            proc.kill();
            cleanup();
            reject(new Error("Piper timed out"));
        }, PIPER_TIMEOUT_MS);

        proc.stderr.on("data", (c: Buffer) => {
            stderr += c.toString();
        });
        proc.on("error", (e) => {
            clearTimeout(timer);
            cleanup();
            reject(e);
        });
        proc.on("close", (code) => {
            clearTimeout(timer);
            if (code !== 0) {
                cleanup();
                reject(new Error(`Piper failed (code ${code}): ${stderr.slice(0, 200)}`));
                return;
            }
            try {
                const audio = readFileSync(outFile);
                cleanup();
                if (audio.length < 64) {
                    reject(new Error("Piper produced no audio"));
                    return;
                }
                resolve(audio);
            } catch (e) {
                cleanup();
                reject(e as Error);
            }
        });

        proc.stdin.write(text);
        proc.stdin.end();
    });
}

/**
 * Shift the pitch of a 16-bit PCM WAV by resampling, keeping the duration
 * roughly intact (the caller compensates with `lengthScale`).
 *
 * Turkish has exactly ONE open-source Piper voice, so this is what lets a single
 * model provide recognisably different characters — lower for male, higher for
 * female. It is a deliberate trade-off: distinguishable, not studio quality.
 */
export function pitchShiftWav(wav: Buffer, factor: number): Buffer {
    if (!Number.isFinite(factor) || Math.abs(factor - 1) < 0.01) return wav;
    if (wav.length < 44 || wav.toString("ascii", 0, 4) !== "RIFF") return wav;

    // Locate the data chunk (Piper emits a canonical 44-byte header, but scan
    // anyway so an extra chunk cannot corrupt the output).
    let offset = 12;
    let dataOffset = -1;
    let dataSize = 0;
    while (offset + 8 <= wav.length) {
        const id = wav.toString("ascii", offset, offset + 4);
        const size = wav.readUInt32LE(offset + 4);
        if (id === "data") {
            dataOffset = offset + 8;
            dataSize = Math.min(size, wav.length - dataOffset);
            break;
        }
        offset += 8 + size + (size % 2);
    }
    if (dataOffset < 0 || dataSize <= 0) return wav;

    const inSamples = Math.floor(dataSize / 2);
    const outSamples = Math.max(1, Math.floor(inSamples / factor));
    const out = Buffer.alloc(44 + outSamples * 2);
    wav.copy(out, 0, 0, 44);

    for (let i = 0; i < outSamples; i++) {
        const pos = i * factor;
        const idx = Math.floor(pos);
        const frac = pos - idx;
        const a = wav.readInt16LE(dataOffset + Math.min(idx, inSamples - 1) * 2);
        const b = wav.readInt16LE(dataOffset + Math.min(idx + 1, inSamples - 1) * 2);
        const v = Math.max(-32768, Math.min(32767, Math.round(a + (b - a) * frac)));
        out.writeInt16LE(v, 44 + i * 2);
    }

    out.writeUInt32LE(36 + outSamples * 2, 4);
    out.writeUInt32LE(outSamples * 2, 40);
    return out;
}
