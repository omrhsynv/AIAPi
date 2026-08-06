import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, type PluginOption } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

// Attaches the realtime WebSocket gateway (/realtime/v1) to the Vite dev
// server's HTTP server. Production (react-router-serve) does not expose the
// underlying server for upgrade hooks — run a custom Node/Express server there
// and call attachRealtimeGateway(httpServer) yourself.
function realtimeGatewayPlugin(): PluginOption {
    return {
        name: "realtime-gateway",
        apply: "serve",
        configureServer(server) {
            const httpServer = server.httpServer;
            if (!httpServer) return;
            httpServer.once("listening", async () => {
                try {
                    const { attachRealtimeGateway } = await server.ssrLoadModule(
                        "/app/lib/realtime-gateway.server.ts",
                    );
                    attachRealtimeGateway(httpServer);
                    server.config.logger.info("  ➜  Realtime:  ws gateway on /realtime/v1");
                } catch (error) {
                    server.config.logger.error(
                        "Failed to attach realtime gateway: " + (error as Error).message,
                    );
                }
            });
        },
    };
}

export default defineConfig({
    plugins: [tailwindcss(), reactRouter(), tsconfigPaths(), realtimeGatewayPlugin()],
    server: {
        allowedHosts: true,
    },
});
