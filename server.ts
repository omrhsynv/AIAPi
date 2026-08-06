import "dotenv/config";
import { createServer } from "node:http";
import express from "express";
import { createRequestHandler } from "@react-router/express";
import { attachRealtimeGateway, GATEWAY_PATH } from "./app/lib/realtime-gateway.server";

/**
 * Production server (Phase 5).
 *
 * `react-router-serve` does not expose the underlying HTTP server, so it can't
 * host WebSocket upgrades. This Express server does both jobs:
 *   - serves the built React Router app (run `npm run build` first)
 *   - attaches the realtime WS gateway on /realtime/v1
 *
 * Run with: npm run start:realtime   (tsx executes this file directly, so the
 * gateway's TypeScript sources are imported without a separate build step)
 */

const port = Number(process.env.PORT || 3000);

async function main() {
    const app = express();
    app.disable("x-powered-by");

    // Hashed build assets are immutable; everything else short-cached.
    app.use("/assets", express.static("build/client/assets", { immutable: true, maxAge: "1y" }));
    app.use(express.static("build/client", { maxAge: "1h" }));

    // The build artifact has no type declarations; it exists after `npm run build`.
    // @ts-expect-error -- untyped build output
    const build = (await import("./build/server/index.js")) as import("react-router").ServerBuild;
    app.use(createRequestHandler({ build }));

    const server = createServer(app);
    attachRealtimeGateway(server);

    server.listen(port, () => {
        console.log(`AIAPi listening on http://localhost:${port}`);
        console.log(`Realtime gateway on ws://localhost:${port}${GATEWAY_PATH}`);

        // .env is read once at startup — surface the values that silently break
        // the NPC if they are stale, so a wrong URL is obvious immediately.
        const llmUrl = process.env.AGENT_LLM_URL || "";
        if (!llmUrl) {
            console.warn("⚠  AGENT_LLM_URL is not set — the Agora agent cannot reach this backend.");
        } else if (/your-backend|localhost|127\.0\.0\.1/i.test(llmUrl)) {
            console.warn(`⚠  AGENT_LLM_URL is not publicly reachable: ${llmUrl}`);
            console.warn("   Agora's cloud calls this URL. Set your public/ngrok URL and restart.");
        } else {
            console.log(`Agora LLM callback URL: ${llmUrl}`);
        }
    });
}

main().catch((error) => {
    console.error("Server failed to start:", error);
    process.exit(1);
});
