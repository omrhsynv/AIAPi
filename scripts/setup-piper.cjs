/**
 * Download Piper (local, offline, open-source TTS) and the voice models the
 * catalog needs.
 *
 * Usage:  npm run piper:setup
 *
 * Installs into PIPER_DIR (default ./piper):
 *   piper/piper.exe          the synthesizer
 *   piper/voices/*.onnx      voice models + their .json configs
 *
 * Then set PIPER_ENABLED=true in .env and restart the backend. Until then the
 * TTS layer keeps using whichever paid provider is configured.
 */

const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const PIPER_DIR = process.env.PIPER_DIR || path.join(process.cwd(), "piper");
const VOICES_DIR = path.join(PIPER_DIR, "voices");

const PIPER_RELEASE =
    "https://github.com/rhasspy/piper/releases/download/2023.11.14-2/piper_windows_amd64.zip";

// Hugging Face layout: <lang>/<locale>/<name>/<quality>/<file>
const HF = "https://huggingface.co/rhasspy/piper-voices/resolve/main";
const VOICES = [
    // Turkish — the only open Turkish voice. Single speaker; the catalog gives
    // each character a distinct pitch. NOTE: CC BY-NC-SA (non-commercial).
    { file: "tr_TR-dfki-medium.onnx", url: `${HF}/tr/tr_TR/dfki/medium/tr_TR-dfki-medium.onnx` },
    { file: "tr_TR-dfki-medium.onnx.json", url: `${HF}/tr/tr_TR/dfki/medium/tr_TR-dfki-medium.onnx.json` },
    // English — multi-speaker, so the 20 characters really are 20 voices here.
    { file: "en_US-libritts_r-medium.onnx", url: `${HF}/en/en_US/libritts_r/medium/en_US-libritts_r-medium.onnx` },
    { file: "en_US-libritts_r-medium.onnx.json", url: `${HF}/en/en_US/libritts_r/medium/en_US-libritts_r-medium.onnx.json` },
    // Fallback for any other language.
    { file: "en_US-lessac-medium.onnx", url: `${HF}/en/en_US/lessac/medium/en_US-lessac-medium.onnx` },
    { file: "en_US-lessac-medium.onnx.json", url: `${HF}/en/en_US/lessac/medium/en_US-lessac-medium.onnx.json` },
];

function log(msg) {
    console.log(msg);
}

async function download(url, dest) {
    if (fs.existsSync(dest) && fs.statSync(dest).size > 0) {
        log(`  ✓ already present: ${path.basename(dest)}`);
        return;
    }
    log(`  ↓ ${path.basename(dest)} …`);
    const res = await fetch(url, { redirect: "follow" });
    if (!res.ok) throw new Error(`${res.status} ${res.statusText} for ${url}`);
    const buf = Buffer.from(await res.arrayBuffer());
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.writeFileSync(dest, buf);
    log(`    ${(buf.length / 1024 / 1024).toFixed(1)} MB`);
}

async function main() {
    fs.mkdirSync(VOICES_DIR, { recursive: true });

    // 1) the piper binary
    const exe = path.join(PIPER_DIR, "piper", "piper.exe");
    if (fs.existsSync(exe)) {
        log("Piper binary already installed.");
    } else {
        log("Downloading Piper…");
        const zip = path.join(PIPER_DIR, "piper.zip");
        await download(PIPER_RELEASE, zip);
        log("Extracting…");
        const r = spawnSync(
            "powershell",
            ["-NoProfile", "-Command", `Expand-Archive -Path "${zip}" -DestinationPath "${PIPER_DIR}" -Force`],
            { stdio: "inherit" },
        );
        if (r.status !== 0) throw new Error("Extraction failed");
        fs.unlinkSync(zip);
    }

    // 2) the voice models
    log("Downloading voice models…");
    for (const v of VOICES) {
        await download(v.url, path.join(VOICES_DIR, v.file));
    }

    log("");
    log("✓ Piper ready.");
    log("  Set PIPER_ENABLED=true in .env, then restart the backend.");
    log("  Turkish model licence: CC BY-NC-SA (non-commercial) — review before shipping.");
}

main().catch((e) => {
    console.error("✗ setup failed:", e.message);
    process.exit(1);
});
