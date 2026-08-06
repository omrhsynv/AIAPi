import { randomUUID } from "node:crypto";
import { prisma } from "./db.server";
import { resolveAgent, collectAgentResponse, toAgentMessages, type AgentMessage } from "./agent-api.server";
import { lookupAnswer, storeAnswer } from "./realtime-cache.server";

/**
 * Realtime session lifecycle — server-authoritative, Prisma-backed.
 *
 * Ported from the Aris888 metaverse platform's realtimeSessionService and
 * adapted to AIAPi's Prisma + RAG stack. Unlike Aris888 (whose voice path had
 * NO RAG), `processTextTurn` here resolves the character's assistant and answers
 * through AIAPi's file_search RAG from the start.
 */

export const DEFAULT_IDLE_TIMEOUT_MS = Number(process.env.REALTIME_IDLE_TIMEOUT_MS || 120_000);
export const DEFAULT_RECONNECT_GRACE_MS = Number(process.env.REALTIME_RECONNECT_GRACE_MS || 25_000);
// Keep spoken/voiced answers short (same rationale as the Agora path).
const REALTIME_MAX_OUTPUT_TOKENS = 220;

export type RealtimeSessionRow = {
    sessionId: string;
    orgId: string;
    gameId: string;
    characterId: string;
    playerId: string;
    locale: string;
    state: string;
    connectionId: string | null;
    ttlSeconds: number;
    expiresAt: Date;
    resumeExpiresAt: Date | null;
};

export function createId(prefix: string): string {
    return `${prefix}_${randomUUID()}`;
}

export function isSessionExpired(session: { expiresAt: Date } | null): boolean {
    if (!session?.expiresAt) return false;
    return new Date(session.expiresAt).getTime() <= Date.now();
}

export class RealtimeSessionError extends Error {
    code: string;
    constructor(message: string, code = "SESSION_EXPIRED") {
        super(message);
        this.code = code;
    }
}

/** Close any active session for the same (org, game, player, character). */
export async function closeSupersededSessions(claims: {
    orgId: string;
    gameId: string;
    playerId: string;
    characterId: string;
}): Promise<void> {
    await prisma.realtimeSession.updateMany({
        where: {
            orgId: claims.orgId,
            gameId: claims.gameId,
            playerId: claims.playerId,
            characterId: claims.characterId,
            state: { in: ["active", "interrupted"] },
        },
        data: { state: "closed", closeReason: "superseded", closedAt: new Date() },
    });
}

export async function startSession(params: {
    claims: { orgId: string; gameId: string; characterId: string; playerId: string; locale: string; ttlSeconds: number };
    connectionId: string;
    resumeSessionId?: string | null;
}): Promise<{ session: RealtimeSessionRow; resumed: boolean }> {
    if (params.resumeSessionId) {
        return resumeSession({ claims: params.claims, connectionId: params.connectionId, resumeSessionId: params.resumeSessionId });
    }

    await closeSupersededSessions(params.claims);

    const ttlSeconds = params.claims.ttlSeconds;
    const now = Date.now();
    const row = await prisma.realtimeSession.create({
        data: {
            sessionId: createId("sess"),
            orgId: params.claims.orgId,
            gameId: params.claims.gameId,
            characterId: params.claims.characterId,
            playerId: params.claims.playerId,
            locale: params.claims.locale,
            state: "active",
            connectionId: params.connectionId,
            ttlSeconds,
            expiresAt: new Date(now + ttlSeconds * 1000),
            resumeExpiresAt: new Date(now + DEFAULT_RECONNECT_GRACE_MS),
        },
    });

    return { session: row, resumed: false };
}

export async function resumeSession(params: {
    claims: { orgId: string; gameId: string; characterId: string; playerId: string };
    connectionId: string;
    resumeSessionId: string;
}): Promise<{ session: RealtimeSessionRow; resumed: boolean }> {
    const existing = await prisma.realtimeSession.findUnique({ where: { sessionId: params.resumeSessionId } });
    if (!existing || existing.state === "closed") {
        throw new RealtimeSessionError("Realtime session cannot be resumed");
    }

    for (const key of ["orgId", "gameId", "characterId", "playerId"] as const) {
        if (String(existing[key]) !== String(params.claims[key])) {
            throw new RealtimeSessionError(`Token claim mismatch: ${key}`, "AUTH_CLAIM_MISMATCH");
        }
    }

    if (isSessionExpired(existing)) {
        await closeSession({ sessionId: existing.sessionId, reason: "ttl_expired" });
        throw new RealtimeSessionError("Realtime session TTL expired");
    }

    if (existing.resumeExpiresAt && new Date(existing.resumeExpiresAt).getTime() < Date.now()) {
        await closeSession({ sessionId: existing.sessionId, reason: "reconnect_grace_expired" });
        throw new RealtimeSessionError("Realtime session reconnect grace window expired");
    }

    const row = await prisma.realtimeSession.update({
        where: { sessionId: existing.sessionId },
        data: { state: "active", connectionId: params.connectionId, lastSeenAt: new Date() },
    });

    return { session: row, resumed: true };
}

export async function markInterrupted(sessionId: string): Promise<void> {
    await prisma.realtimeSession.updateMany({
        where: { sessionId, state: { in: ["active", "interrupted"] } },
        data: { state: "interrupted", lastSeenAt: new Date() },
    });
}

export async function closeSession(params: { sessionId: string; reason?: string }): Promise<void> {
    if (!params.sessionId) return;
    await prisma.realtimeSession.updateMany({
        where: { sessionId: params.sessionId, state: { not: "closed" } },
        data: { state: "closed", closeReason: params.reason ?? "closed", closedAt: new Date(), connectionId: null, lastSeenAt: new Date() },
    });
}

export async function detachConnectionForReconnect(params: { sessionId: string; reason?: string }): Promise<void> {
    if (!params.sessionId) return;
    await prisma.realtimeSession.updateMany({
        where: { sessionId: params.sessionId, state: { in: ["active", "interrupted"] } },
        data: {
            connectionId: null,
            resumeExpiresAt: new Date(Date.now() + DEFAULT_RECONNECT_GRACE_MS),
            closeReason: params.reason ?? "disconnect",
            lastSeenAt: new Date(),
        },
    });
}

export async function assertSessionActive(session: RealtimeSessionRow | null): Promise<RealtimeSessionRow> {
    if (!session) throw new RealtimeSessionError("Realtime session not found");
    if (session.state === "closed") throw new RealtimeSessionError("Realtime session is closed");
    if (isSessionExpired(session)) {
        await closeSession({ sessionId: session.sessionId, reason: "ttl_expired" });
        throw new RealtimeSessionError("Realtime session TTL expired");
    }
    return session;
}

/**
 * Resolve which assistant answers for a character. `characterId` is treated as
 * an assistant id/slug; falls back to AGENT_LLM_MODEL. This is the seam that
 * gives the realtime loop RAG for free.
 */
async function resolveAssistantForCharacter(characterId: string) {
    const primary = await resolveAgent(characterId);
    if (primary.ok) return primary.agent;
    const fallbackRef = (process.env.AGENT_LLM_MODEL || "").trim();
    if (fallbackRef) {
        const fallback = await resolveAgent(fallbackRef);
        if (fallback.ok) return fallback.agent;
    }
    throw new RealtimeSessionError(`No assistant mapped for characterId "${characterId}"`, "VALIDATION_ERROR");
}

/**
 * Process one text turn through RAG. Persists the turn and returns the answer.
 * `history` is the prior conversation (optional) so multi-turn context works.
 */
export async function processTextTurn(params: {
    session: RealtimeSessionRow;
    text: string;
    history?: AgentMessage[];
    turnId?: string;
}): Promise<{ turnId: string; text: string; inputTokens: number; outputTokens: number; turnCompleteMs: number; cached: boolean }> {
    const text = String(params.text || "").trim();
    if (!text) throw new RealtimeSessionError("text is required", "VALIDATION_ERROR");

    await assertSessionActive(params.session);

    const turnId = params.turnId || createId("turn");
    const startedAt = Date.now();
    const cacheKey = { orgId: params.session.orgId, gameId: params.session.gameId, characterId: params.session.characterId };

    const messages: AgentMessage[] = [...(params.history ?? []), { role: "user", content: text }];

    await prisma.realtimeTurn.create({
        data: { turnId, sessionId: params.session.sessionId, inputText: text, state: "started" },
    });

    try {
        // Shared cache: another player may have already asked this NPC the same
        // (or a similar) question — reuse that answer, no GPT/RAG spend.
        const hit = await lookupAnswer(cacheKey, text);
        if (hit) {
            const turnCompleteMs = Date.now() - startedAt;
            await prisma.realtimeTurn.update({
                where: { turnId },
                data: { outputText: hit.answer, state: "completed", inputTokens: 0, outputTokens: 0, completedAt: new Date() },
            });
            return { turnId, text: hit.answer, inputTokens: 0, outputTokens: 0, turnCompleteMs, cached: true };
        }

        const agent = await resolveAssistantForCharacter(params.session.characterId);
        const { text: answer, usage } = await collectAgentResponse(agent, messages, REALTIME_MAX_OUTPUT_TOKENS);
        const turnCompleteMs = Date.now() - startedAt;

        await prisma.realtimeTurn.update({
            where: { turnId },
            data: {
                outputText: answer,
                state: "completed",
                inputTokens: usage.inputTokens,
                outputTokens: usage.outputTokens,
                completedAt: new Date(),
            },
        });
        await prisma.realtimeSession.updateMany({
            where: { sessionId: params.session.sessionId },
            data: { state: "active", lastSeenAt: new Date() },
        });

        // Only cache standalone Q&A (no prior conversation context in this turn).
        if ((params.history?.length ?? 0) === 0) {
            storeAnswer(cacheKey, text, answer).catch(() => null);
        }

        return { turnId, text: answer, inputTokens: usage.inputTokens, outputTokens: usage.outputTokens, turnCompleteMs, cached: false };
    } catch (error) {
        await prisma.realtimeTurn
            .updateMany({ where: { turnId, state: "started" }, data: { state: "failed", errorCode: (error as { code?: string }).code || "INTERNAL_ERROR", completedAt: new Date() } })
            .catch(() => null);
        throw error;
    }
}

export { toAgentMessages };
