import type { Server as HttpServer } from "node:http";
import { randomUUID } from "node:crypto";
import { WebSocketServer, type WebSocket } from "ws";
import {
    verifyRealtimeSessionToken,
    assertClaimBinding,
    type RealtimeClaims,
} from "./realtime-token.server";
import {
    startSession,
    closeSession,
    markInterrupted,
    detachConnectionForReconnect,
    assertSessionActive,
    isSessionExpired,
    processTextTurn,
    type RealtimeSessionRow,
} from "./realtime-session.server";
import type { AgentMessage } from "./agent-api.server";
import { RealtimeVoiceTurnManager, isVoiceMockMode } from "./realtime-voice.server";
import { emitTranslations, normalizePartyLocales, CANONICAL_LOCALE } from "./realtime-translation.server";

/**
 * Realtime WebSocket gateway (Phase 2) — ported from the Aris888 metaverse
 * platform's realtimeGatewayService onto AIAPi's stack.
 *
 * Transport for the server-authoritative NPC session: the client connects to
 * `/realtime/v1`, sends `session.start` with the ephemeral JWT, then exchanges
 * a versioned, typed event protocol. This phase carries the text realtime loop
 * (RAG answers) plus session lifecycle, heartbeat, idle/TTL, and reconnect.
 * Voice-over-WS is Phase 3.
 *
 * Attach it to the underlying HTTP server (see vite.config.ts for the dev
 * wiring, or a custom production server).
 */

export const GATEWAY_PATH = "/realtime/v1";
export const PROTOCOL_VERSION = "1.0";

const PENDING_TIMEOUT_MS = Number(process.env.REALTIME_PENDING_TIMEOUT_MS || 10_000);
const HEARTBEAT_INTERVAL_MS = Number(process.env.REALTIME_HEARTBEAT_INTERVAL_MS || 15_000);
const HEARTBEAT_MISS_LIMIT = Number(process.env.REALTIME_HEARTBEAT_MISS_LIMIT || 2);
const IDLE_TIMEOUT_MS = Number(process.env.REALTIME_IDLE_TIMEOUT_MS || 120_000);
const MAX_MESSAGE_BYTES = Number(process.env.REALTIME_MAX_MESSAGE_BYTES || 64 * 1024);
// Per-connection flood guard for audio.chunk (Aris888's realtimeRateLimit port).
const MAX_AUDIO_EVENTS_PER_SECOND = Number(process.env.REALTIME_MAX_EVENTS_PER_SECOND || 50);

const CLIENT_EVENT_TYPES = new Set([
    "session.start",
    "text.message",
    "audio.chunk",
    "turn.commit",
    "interruption.signal",
    "session.end",
    "pong",
    "context.update",
    "locale.set",
]);

type ConnContext = {
    connectionId: string;
    session: RealtimeSessionRow | null;
    claims: RealtimeClaims | null;
    state: "pending" | "active" | "interrupted" | "closing" | "closed";
    heartbeatMisses: number;
    lastActivityAt: number;
    history: AgentMessage[];
    voiceEnabled: boolean;
    voiceManager: RealtimeVoiceTurnManager | null;
    translationEnabled: boolean;
    partyLocales: string[];
    rateWindowStart: number;
    rateCount: number;
};

function buildEnvelope(type: string, payload: object, sessionId: string | null) {
    return JSON.stringify({
        protocolVersion: PROTOCOL_VERSION,
        eventId: randomUUID(),
        sessionId,
        timestamp: new Date().toISOString(),
        type,
        payload,
    });
}

function safeJsonParse(raw: string): Record<string, unknown> | null {
    try {
        return JSON.parse(raw) as Record<string, unknown>;
    } catch {
        return null;
    }
}

export function validateEnvelope(envelope: Record<string, unknown> | null): string | null {
    if (!envelope || typeof envelope !== "object") return "Envelope must be a JSON object";
    if (envelope.protocolVersion !== PROTOCOL_VERSION) {
        const error = new Error("Unsupported protocol version");
        (error as { code?: string }).code = "PROTOCOL_VERSION_UNSUPPORTED";
        throw error;
    }
    if (!envelope.eventId || typeof envelope.eventId !== "string") return "eventId is required";
    if (!envelope.timestamp || Number.isNaN(Date.parse(String(envelope.timestamp)))) return "timestamp must be ISO-8601";
    if (typeof envelope.type !== "string" || !CLIENT_EVENT_TYPES.has(envelope.type)) {
        return `Unsupported client event type: ${String(envelope.type)}`;
    }
    if (!envelope.payload || typeof envelope.payload !== "object" || Array.isArray(envelope.payload)) {
        return "payload must be an object";
    }
    return null;
}

function makeSender(ws: WebSocket, getSessionId: () => string | null) {
    return (type: string, payload: object = {}) => {
        if (ws.readyState !== ws.OPEN) return;
        ws.send(buildEnvelope(type, payload, getSessionId()));
    };
}

type Send = ReturnType<typeof makeSender>;

function sendError(send: Send, opts: { code?: string; message?: string; recoverable?: boolean }) {
    send("error", {
        code: opts.code ?? "VALIDATION_ERROR",
        message: opts.message ?? "Realtime protocol error",
        recoverable: opts.recoverable ?? true,
    });
}

async function handleSessionStart(ctx: ConnContext, envelope: Record<string, unknown>, send: Send) {
    const payload = (envelope.payload ?? {}) as { authToken?: string; context?: Record<string, unknown>; resumeSessionId?: string };
    const claims = verifyRealtimeSessionToken(payload.authToken);
    assertClaimBinding(claims, (payload.context ?? {}) as Partial<RealtimeClaims>);

    const { session, resumed } = await startSession({
        claims,
        connectionId: ctx.connectionId,
        resumeSessionId: payload.resumeSessionId ?? null,
    });

    ctx.session = session;
    ctx.claims = claims;
    ctx.state = "active";
    ctx.lastActivityAt = Date.now();

    const capabilities = (payload as {
        capabilities?: { audioIn?: boolean; voice?: string; translation?: boolean; partyLocales?: unknown };
    }).capabilities ?? {};
    ctx.voiceEnabled = capabilities.audioIn === true;
    ctx.partyLocales = normalizePartyLocales(capabilities.partyLocales);
    ctx.translationEnabled = capabilities.translation === true || ctx.partyLocales.length > 0;
    if (ctx.voiceEnabled) {
        ctx.voiceManager = new RealtimeVoiceTurnManager({
            session,
            send,
            history: ctx.history,
            voiceId: capabilities.voice,
            translationEnabled: ctx.translationEnabled,
            partyLocales: ctx.partyLocales,
        });
    }

    send("session.started", {
        resumed,
        locale: session.locale,
        expiresAt: session.expiresAt,
        capabilities: {
            text: true,
            audioIn: ctx.voiceEnabled,
            audioOut: ctx.voiceEnabled,
            voiceMockMode: ctx.voiceEnabled && isVoiceMockMode(),
            translation: ctx.translationEnabled,
            canonicalLocale: CANONICAL_LOCALE,
            partyLocales: ctx.partyLocales,
        },
        limits: {
            heartbeatIntervalMs: HEARTBEAT_INTERVAL_MS,
            reconnectGraceMs: Number(process.env.REALTIME_RECONNECT_GRACE_MS || 25_000),
            ttlSeconds: session.ttlSeconds,
        },
    });
}

function chunkText(text: string): string[] {
    const words = text.trim().split(/\s+/);
    if (words.length <= 2) return [text.trim()];
    const chunks: string[] = [];
    for (let i = 0; i < words.length; i += 3) {
        chunks.push(words.slice(0, i + 3).join(" "));
    }
    return chunks;
}

async function handleTextMessage(ctx: ConnContext, envelope: Record<string, unknown>, send: Send) {
    if (!ctx.session || !["active", "interrupted"].includes(ctx.state)) {
        sendError(send, { code: "SESSION_NOT_ACTIVE", message: "Session must be active before text.message" });
        return;
    }
    await assertSessionActive(ctx.session);

    const payload = (envelope.payload ?? {}) as { text?: string; turnId?: string };
    const turn = await processTextTurn({
        session: ctx.session,
        text: String(payload.text ?? ""),
        history: ctx.history,
        turnId: payload.turnId,
    });

    // Record context for multi-turn continuity.
    ctx.history.push({ role: "user", content: String(payload.text ?? "") });
    ctx.history.push({ role: "assistant", content: turn.text });
    if (ctx.history.length > 20) ctx.history = ctx.history.slice(-20);

    for (const chunk of chunkText(turn.text)) {
        send("response.partial", { turnId: turn.turnId, text: chunk });
    }
    send("response.final", { turnId: turn.turnId, text: turn.text });

    if (ctx.translationEnabled && turn.text) {
        // Fire-and-forget: translation must never delay or break the turn.
        emitTranslations({
            send,
            turnId: turn.turnId,
            text: turn.text,
            orgId: ctx.session.orgId,
            gameId: ctx.session.gameId,
            playerLocale: ctx.session.locale,
            partyLocales: ctx.partyLocales,
        }).catch(() => null);
    }

    send("session.metrics", {
        turnId: turn.turnId,
        turnCompleteMs: turn.turnCompleteMs,
        inputTokens: turn.inputTokens,
        outputTokens: turn.outputTokens,
        cached: turn.cached,
    });

    ctx.state = "active";
    ctx.lastActivityAt = Date.now();
}

async function handleInterruption(ctx: ConnContext, envelope: Record<string, unknown>, send: Send) {
    ctx.voiceManager?.interrupt();
    if (ctx.session) await markInterrupted(ctx.session.sessionId);
    ctx.state = "interrupted";
    ctx.lastActivityAt = Date.now();
    const turnId = (envelope.payload as { turnId?: string })?.turnId ?? null;
    send("moderation.event", { action: "interrupted", turnId });
}

function checkAudioRate(ctx: ConnContext): boolean {
    const now = Date.now();
    if (now - ctx.rateWindowStart >= 1000) {
        ctx.rateWindowStart = now;
        ctx.rateCount = 0;
    }
    ctx.rateCount += 1;
    return ctx.rateCount <= MAX_AUDIO_EVENTS_PER_SECOND;
}

function handleAudioChunk(ctx: ConnContext, envelope: Record<string, unknown>, send: Send) {
    if (!checkAudioRate(ctx)) {
        sendError(send, { code: "RATE_LIMITED", message: "audio.chunk rate limit exceeded" });
        return;
    }
    if (!ctx.voiceEnabled || !ctx.voiceManager) {
        sendError(send, { code: "PHASE_NOT_ENABLED", message: "Voice not enabled (set capabilities.audioIn on session.start)" });
        return;
    }
    if (!ctx.session || !["active", "interrupted"].includes(ctx.state)) {
        sendError(send, { code: "SESSION_NOT_ACTIVE", message: "Session must be active before audio.chunk" });
        return;
    }
    ctx.voiceManager.appendAudio((envelope.payload ?? {}) as { dataBase64?: string; turnId?: string });
    ctx.state = "active";
    ctx.lastActivityAt = Date.now();
}

async function handleTurnCommit(ctx: ConnContext, envelope: Record<string, unknown>, send: Send) {
    if (!ctx.voiceEnabled || !ctx.voiceManager) {
        sendError(send, { code: "PHASE_NOT_ENABLED", message: "Voice turn requires capabilities.audioIn" });
        return;
    }
    if (!ctx.session || !["active", "interrupted"].includes(ctx.state)) {
        sendError(send, { code: "SESSION_NOT_ACTIVE", message: "Session must be active before turn.commit" });
        return;
    }
    await assertSessionActive(ctx.session);
    await ctx.voiceManager.commit((envelope.payload ?? {}) as { turnId?: string });
    ctx.state = "active";
    ctx.lastActivityAt = Date.now();
}

async function terminate(ctx: ConnContext, send: Send, ws: WebSocket, reason: string, code = 1000) {
    await ctx.voiceManager?.destroy().catch(() => null);
    ctx.voiceManager = null;
    if (ctx.session && ctx.state !== "closed") {
        ctx.state = "closing";
        await closeSession({ sessionId: ctx.session.sessionId, reason }).catch(() => null);
        ctx.state = "closed";
        send("session.end", { reason });
    }
    ws.close(code, reason);
}

async function handleClientEvent(ctx: ConnContext, envelope: Record<string, unknown>, send: Send, ws: WebSocket) {
    if (!ctx.session && envelope.type !== "session.start") {
        sendError(send, { code: "SESSION_NOT_STARTED", message: "First event must be session.start", recoverable: false });
        return;
    }

    switch (envelope.type) {
        case "session.start":
            await handleSessionStart(ctx, envelope, send);
            return;
        case "text.message":
            await handleTextMessage(ctx, envelope, send);
            return;
        case "audio.chunk":
            handleAudioChunk(ctx, envelope, send);
            return;
        case "turn.commit":
            await handleTurnCommit(ctx, envelope, send);
            return;
        case "interruption.signal":
            await handleInterruption(ctx, envelope, send);
            return;
        case "session.end":
            await terminate(ctx, send, ws, String((envelope.payload as { reason?: string })?.reason ?? "client_close"));
            return;
        case "pong":
            ctx.heartbeatMisses = 0;
            ctx.lastActivityAt = Date.now();
            return;
        case "context.update":
        case "locale.set":
            ctx.lastActivityAt = Date.now();
            return;
        default:
            sendError(send, { code: "VALIDATION_ERROR", message: `Unsupported event: ${String(envelope.type)}` });
    }
}

export function attachRealtimeGateway(server: HttpServer, options: { logger?: Pick<Console, "warn"> } = {}): WebSocketServer {
    const wss = new WebSocketServer({ noServer: true, maxPayload: MAX_MESSAGE_BYTES });
    const logger = options.logger ?? console;

    server.on("upgrade", (req, socket, head) => {
        const pathname = String(req.url || "").split("?")[0];
        if (pathname !== GATEWAY_PATH) return;
        wss.handleUpgrade(req, socket, head, (ws) => wss.emit("connection", ws, req));
    });

    wss.on("connection", (ws: WebSocket) => {
        const ctx: ConnContext = {
            connectionId: `conn_${randomUUID()}`,
            session: null,
            claims: null,
            state: "pending",
            heartbeatMisses: 0,
            lastActivityAt: Date.now(),
            history: [],
            voiceEnabled: false,
            voiceManager: null,
            translationEnabled: false,
            partyLocales: [],
            rateWindowStart: Date.now(),
            rateCount: 0,
        };
        const send = makeSender(ws, () => ctx.session?.sessionId ?? null);

        const pendingTimer = setTimeout(() => {
            if (!ctx.session) {
                sendError(send, { code: "AUTH_INVALID", message: "session.start not received before pending timeout", recoverable: false });
                ws.close(1008, "pending_timeout");
            }
        }, PENDING_TIMEOUT_MS);

        const heartbeatTimer = setInterval(async () => {
            if (ws.readyState !== ws.OPEN) return;
            try {
                if (ctx.session) {
                    if (Date.now() - ctx.lastActivityAt >= IDLE_TIMEOUT_MS) {
                        clearInterval(heartbeatTimer);
                        await terminate(ctx, send, ws, "idle_timeout", 1001);
                        return;
                    }
                    if (isSessionExpired(ctx.session)) {
                        clearInterval(heartbeatTimer);
                        await terminate(ctx, send, ws, "ttl_expired", 1001);
                        return;
                    }
                }
                if (ctx.heartbeatMisses >= HEARTBEAT_MISS_LIMIT) {
                    clearInterval(heartbeatTimer);
                    await terminate(ctx, send, ws, "heartbeat_timeout", 1001);
                    return;
                }
                ctx.heartbeatMisses += 1;
                send("ping", { heartbeatMisses: ctx.heartbeatMisses });
                ws.ping();
            } catch (error) {
                logger.warn?.("Realtime heartbeat check failed", (error as Error).message);
            }
        }, HEARTBEAT_INTERVAL_MS);

        ws.on("pong", () => {
            ctx.heartbeatMisses = 0;
        });

        ws.on("message", async (raw: Buffer) => {
            const envelope = safeJsonParse(raw.toString("utf8"));
            try {
                const validationError = validateEnvelope(envelope);
                if (validationError) {
                    sendError(send, { code: "VALIDATION_ERROR", message: validationError });
                    return;
                }
                await handleClientEvent(ctx, envelope as Record<string, unknown>, send, ws);
            } catch (error) {
                const code = (error as { code?: string }).code || "INTERNAL_ERROR";
                const fatal = ["AUTH_INVALID", "AUTH_CLAIM_MISMATCH"].includes(code);
                sendError(send, { code, message: (error as Error).message || "Realtime gateway error", recoverable: !fatal });
                if (fatal) ws.close(1008, code);
                else if (code === "SESSION_EXPIRED" && ctx.session) await terminate(ctx, send, ws, "ttl_expired", 1001);
            }
        });

        ws.on("close", async () => {
            clearTimeout(pendingTimer);
            clearInterval(heartbeatTimer);
            await ctx.voiceManager?.destroy().catch(() => null);
            ctx.voiceManager = null;
            if (!ctx.session || ctx.state === "closing" || ctx.state === "closed") return;
            await detachConnectionForReconnect({ sessionId: ctx.session.sessionId, reason: "transport_disconnect" }).catch((e) =>
                logger.warn?.("Failed to detach realtime session", (e as Error).message),
            );
        });
    });

    return wss;
}
