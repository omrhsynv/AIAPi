/**
 * Sync AGENT_LLM_URL in .env with the tunnel ngrok is currently serving.
 *
 * Agora's cloud calls AGENT_LLM_URL, so it must be a public address. With a
 * random ngrok URL that address changes on every restart; this script reads the
 * live tunnel from ngrok's local API and rewrites .env so you don't have to.
 *
 * Usage:  npm run ngrok:sync     (with ngrok already running)
 *
 * Prefer a permanent fix: claim your free static ngrok domain and start it with
 *   ngrok http 3000 --url=https://<your-domain>.ngrok-free.app
 * then the URL never changes and this script is unnecessary.
 *
 * NOTE: .env is read once at backend startup — restart the backend afterwards.
 */

const fs = require("node:fs");
const path = require("node:path");

const ENV_PATH = path.join(__dirname, "..", ".env");
const NGROK_API = "http://127.0.0.1:4040/api/tunnels";
const LLM_PATH = "/api/agora/chat/completions";

async function main() {
    let tunnels;
    try {
        const res = await fetch(NGROK_API, { signal: AbortSignal.timeout(4000) });
        tunnels = (await res.json()).tunnels || [];
    } catch {
        console.error("✗ ngrok is not running (no local API on 127.0.0.1:4040).");
        console.error("  Start it first:  ngrok http 3000");
        process.exit(1);
    }

    const https = tunnels.find((t) => String(t.public_url).startsWith("https://"));
    if (!https) {
        console.error("✗ ngrok is running but has no https tunnel.");
        process.exit(1);
    }

    const publicUrl = https.public_url.replace(/\/+$/, "");
    const newValue = `${publicUrl}${LLM_PATH}`;

    if (!fs.existsSync(ENV_PATH)) {
        console.error("✗ .env not found at", ENV_PATH);
        process.exit(1);
    }

    const original = fs.readFileSync(ENV_PATH, "utf8");
    const current = (original.match(/^AGENT_LLM_URL=.*$/m) || [""])[0]
        .replace(/^AGENT_LLM_URL=/, "")
        .replace(/^["']|["']$/g, "");

    if (current === newValue) {
        console.log("✓ AGENT_LLM_URL already up to date:");
        console.log("  " + newValue);
        console.log("  (tunnel ->", https.config.addr + ")");
        return;
    }

    const line = `AGENT_LLM_URL="${newValue}"`;
    const updated = /^AGENT_LLM_URL=.*$/m.test(original)
        ? original.replace(/^AGENT_LLM_URL=.*$/m, line)
        : original.trimEnd() + "\n" + line + "\n";

    fs.writeFileSync(ENV_PATH, updated);
    console.log("✓ AGENT_LLM_URL updated");
    console.log("  old:", current || "(empty)");
    console.log("  new:", newValue);
    console.log("");
    console.log("⚠  Restart the backend so it picks up the new value:");
    console.log("   npm run start:realtime");
    console.log("");
    console.log("⚠  Also set Unity → NpcRealtimeSession → Backend Base Url to:");
    console.log("   " + publicUrl);
}

main().catch((error) => {
    console.error("✗ sync failed:", error.message);
    process.exit(1);
});
