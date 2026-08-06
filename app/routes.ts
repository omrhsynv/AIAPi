import { type RouteConfig, index, route, layout, prefix } from "@react-router/dev/routes";

export default [
    // Public routes
    index("routes/home.tsx"),

    // Auth routes (unified login/register)
    route("login", "routes/auth/login.tsx"),
    route("register", "routes/auth/register.tsx"),

    // Public API documentation
    route("docs/agent-api", "routes/docs/agent-api.tsx"),

    // User chat routes (requires auth)
    layout("routes/app/layout.tsx", [
        route("chat", "routes/app/chat.tsx"),
        route("chat/:chatId", "routes/app/chat.tsx", { id: "chat-detail" }),
    ]),

    // Admin routes (requires admin role)
    layout("routes/admin/layout.tsx", [
        route("admin", "routes/admin/index.tsx"),
        route("admin/dashboard", "routes/admin/dashboard.tsx"),
        route("admin/assistants", "routes/admin/assistants.tsx"),
        route("admin/assistants/:assistantId", "routes/admin/assistant-detail.tsx"),
        route("admin/users", "routes/admin/users.tsx"),
        route("admin/api-keys", "routes/admin/api-keys.tsx"),
        route("admin/api-keys/:keyId", "routes/admin/api-key-detail.tsx"),
        route("admin/settings", "routes/admin/settings.tsx"),
    ]),

    // API Routes
    ...prefix("api", [
        route("logout", "routes/api/logout.tsx"),
        route("chat/:chatId", "routes/api/chat.tsx", { id: "api-chat" }),
        route("transcribe", "routes/api/transcribe.tsx"),
        route("tts", "routes/api/tts.tsx"),
        route("assistants", "routes/api/assistants.tsx"),
        route("user/chats", "routes/api/user-chats.tsx"),

        // External Agent API (API-key auth, no browser session)
        // :agent is the assistant id or slug.
        route("v1/agents/:agent", "routes/api/v1/agents.tsx"),

        // AGORA — OpenAI-compatible surface. Agent chosen via the body's
        // `model` field (id or slug); same key auth + DB permissions.
        route("agora/chat/completions", "routes/api/agora/chat-completions.tsx"),
        route("agora/stream", "routes/api/agora/stream.tsx"),

        // REALTIME — Phase 1 security foundation for the multiplayer NPC.
        // Mint an ephemeral session (service-key auth), then the client uses the
        // returned JWT to start/stop the agent and fetch TTS. No provider
        // secrets ship in the game client.
        route("realtime/session", "routes/api/realtime/session.tsx"),
        route("realtime/agent", "routes/api/realtime/agent.tsx"),
        route("realtime/tts", "routes/api/realtime/tts.tsx"),
        route("realtime/history", "routes/api/realtime/history.tsx"),
        route("realtime/stats", "routes/api/realtime/stats.tsx"),

        // Player-to-player live translation: speaker's audio -> transcript,
        // then each listener translates it into their own language (cached).
        route("realtime/speech", "routes/api/realtime/speech.tsx"),
        route("realtime/translate", "routes/api/realtime/translate.tsx"),
        route("realtime/voices", "routes/api/realtime/voices.tsx"),

        // Admin APIs
        route("admin/assistants", "routes/api/admin/assistants.tsx"),
        route("admin/assistants/:assistantId", "routes/api/admin/assistant-detail.tsx"),
        route("admin/assistants/:assistantId/files", "routes/api/admin/assistant-files.tsx"),
        route("admin/users", "routes/api/admin/users.tsx"),
        route("admin/users/:userId/access", "routes/api/admin/user-access.tsx"),
        route("admin/api-keys", "routes/api/admin/api-keys.tsx"),
        route("admin/api-keys/:keyId", "routes/api/admin/api-key-detail.tsx"),

        // Auth API  
        route("auth/*", "routes/api/auth/$.tsx", { id: "api-auth" }),
    ]),
] satisfies RouteConfig;
