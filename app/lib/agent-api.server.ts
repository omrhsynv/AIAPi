import { createHash, randomBytes } from "node:crypto";
import { prisma } from "./db.server";
import { chatStream, type TokenUsage } from "./openai.server";

/**
 * Agent API — server-only logic for external, programmatic access.
 *
 * Auth model: a standalone API key authenticates the caller; the target
 * assistant is chosen per-request by its id or slug. This is the
 * latency-sensitive path, so both the key check and the agent lookup are
 * backed by in-memory TTL caches.
 *
 * Hot path (warm caches): 0 DB queries.
 * Cold path: 1 indexed query each for the key and the agent, run in parallel.
 *
 * The OpenAI call is behind `streamAgentResponse`, which falls back to a mock
 * when no OPENAI_API_KEY is configured so the pipeline stays testable.
 */

// Reused across every request — allocating a TextEncoder per call is wasteful.
const encoder = new TextEncoder();

// How long resolved (or rejected) keys/agents stay cached. Short enough that
// revoking a key or toggling an assistant's `isActive` propagates quickly.
const CACHE_TTL_MS = Number(process.env.AGENT_CACHE_TTL_MS) || 30_000;

// `lastUsedAt` is best-effort — write it at most this often per key, never on
// the request's critical path.
const LAST_USED_THROTTLE_MS = 60_000;

// Everything needed to invoke an assistant.
export type ResolvedAgent = {
    assistantId: string;
    model: string;
    systemInstruction: string;
    vectorStoreId: string | null;
};

export type AgentMessage = {
    role: "user" | "assistant";
    content: string;
};

// Result of checking a key: 401 = unknown key, 403 = revoked.
// `allowed` is the set of assistant ids this key may invoke (DB-driven).
export type KeyResult =
    | { ok: true; apiKeyId: string; allowed: Set<string> }
    | { ok: false; status: 401 | 403; error: string };

// Result of resolving an agent ref: 404 = not found, 403 = inactive.
export type AgentResult =
    | { ok: true; agent: ResolvedAgent }
    | { ok: false; status: 403 | 404; error: string };

type KeyCacheEntry = { value: KeyResult; expires: number };
type AgentCacheEntry = { value: AgentResult; expires: number };

// Survive dev hot-reloads (same guard pattern as db.server.ts).
const globalForCache = globalThis as unknown as {
    __agentKeyCache__?: Map<string, KeyCacheEntry>;
    __agentAgentCache__?: Map<string, AgentCacheEntry>;
    __agentKeyLastUsed__?: Map<string, number>;
};

const keyCache =
    globalForCache.__agentKeyCache__ ?? (globalForCache.__agentKeyCache__ = new Map());
const agentCache =
    globalForCache.__agentAgentCache__ ?? (globalForCache.__agentAgentCache__ = new Map());
const lastUsed =
    globalForCache.__agentKeyLastUsed__ ??
    (globalForCache.__agentKeyLastUsed__ = new Map());

function hashKey(rawKey: string): string {
    return createHash("sha256").update(rawKey).digest("hex");
}

/** Generate a new raw API key (shown once). */
export function generateRawApiKey(): string {
    return `sk_agent_${randomBytes(20).toString("hex")}`;
}

/** Hash a raw key for storage/lookup (sha256 hex). */
export function hashApiKey(rawKey: string): string {
    return hashKey(rawKey);
}

/** Drop a key from the in-memory cache so permission/revoke edits apply now. */
export function invalidateKeyCache(): void {
    keyCache.clear();
}

/** Pull the API key from `Authorization: Bearer <key>` or `x-api-key`. */
export function extractApiKey(headers: Headers): string | null {
    const auth = headers.get("authorization");
    if (auth) {
        const match = /^Bearer\s+(.+)$/i.exec(auth);
        if (match) return match[1].trim();
    }
    const x = headers.get("x-api-key");
    return x ? x.trim() : null;
}

/** Verify an API key. Warm cache = no DB query. */
export async function verifyApiKey(rawKey: string): Promise<KeyResult> {
    const keyHash = hashKey(rawKey);
    const now = Date.now();

    const cached = keyCache.get(keyHash);
    if (cached && cached.expires > now) {
        if (cached.value.ok) touchLastUsed(cached.value.apiKeyId, keyHash, now);
        return cached.value;
    }

    const row = await prisma.apiKey.findUnique({
        where: { keyHash },
        select: { id: true, revoked: true, assistants: { select: { id: true } } },
    });

    let value: KeyResult;
    if (!row) {
        value = { ok: false, status: 401, error: "Invalid API key" };
    } else if (row.revoked) {
        value = { ok: false, status: 403, error: "API key revoked" };
    } else {
        value = {
            ok: true,
            apiKeyId: row.id,
            allowed: new Set(row.assistants.map((a) => a.id)),
        };
    }

    keyCache.set(keyHash, { value, expires: now + CACHE_TTL_MS });
    if (value.ok) touchLastUsed(value.apiKeyId, keyHash, now);
    return value;
}

/** Resolve an agent by id or slug. Warm cache = no DB query. */
export async function resolveAgent(agentRef: string): Promise<AgentResult> {
    const now = Date.now();

    const cached = agentCache.get(agentRef);
    if (cached && cached.expires > now) return cached.value;

    const row = await prisma.assistant.findFirst({
        where: { OR: [{ id: agentRef }, { slug: agentRef }] },
        select: {
            id: true,
            model: true,
            systemInstruction: true,
            vectorStoreId: true,
            isActive: true,
        },
    });

    let value: AgentResult;
    if (!row) {
        value = { ok: false, status: 404, error: "Agent not found" };
    } else if (!row.isActive) {
        value = { ok: false, status: 403, error: "Agent is inactive" };
    } else {
        value = {
            ok: true,
            agent: {
                assistantId: row.id,
                model: row.model,
                systemInstruction: row.systemInstruction,
                vectorStoreId: row.vectorStoreId,
            },
        };
    }

    agentCache.set(agentRef, { value, expires: now + CACHE_TTL_MS });
    return value;
}

// Fire-and-forget, throttled write. Never awaited, so it can't add latency;
// failures are swallowed (best-effort bookkeeping).
function touchLastUsed(apiKeyId: string, keyHash: string, now: number): void {
    const prev = lastUsed.get(keyHash) ?? 0;
    if (now - prev < LAST_USED_THROTTLE_MS) return;
    lastUsed.set(keyHash, now);
    prisma.apiKey
        .update({ where: { id: apiKeyId }, data: { lastUsedAt: new Date() } })
        .catch(() => {
            lastUsed.delete(keyHash); // roll back throttle so we retry next time
        });
}

/**
 * Normalize a request body into the message list for the LLM.
 * Accepts either `{ messages: [{ role, content }] }` (preferred, stateless)
 * or `{ message: "..." }` (convenience). Invalid entries are dropped; the
 * context is capped to the last 50 messages, matching the chat UI.
 */
export function toAgentMessages(body: unknown): AgentMessage[] {
    if (!body || typeof body !== "object") return [];
    const b = body as { messages?: unknown; message?: unknown };

    if (Array.isArray(b.messages)) {
        const out: AgentMessage[] = [];
        for (const m of b.messages) {
            if (
                m &&
                typeof m === "object" &&
                ((m as any).role === "user" || (m as any).role === "assistant") &&
                typeof (m as any).content === "string" &&
                (m as any).content.length > 0
            ) {
                out.push({ role: (m as any).role, content: (m as any).content });
            }
        }
        return out.length > 50 ? out.slice(-50) : out;
    }

    if (typeof b.message === "string" && b.message.length > 0) {
        return [{ role: "user", content: b.message }];
    }

    return [];
}

/**
 * The OpenAI seam. Uses the shared `chatStream` helper (reusing the
 * `getOpenAI()` singleton) when an API key is configured; otherwise falls back
 * to a mock stream so the pipeline stays testable without an OPENAI_API_KEY.
 */
export async function streamAgentResponse(
    agent: ResolvedAgent,
    messages: AgentMessage[],
    onUsage?: (usage: TokenUsage) => void,
): Promise<ReadableStream<Uint8Array>> {
    if (!process.env.OPENAI_API_KEY) {
        return mockStream(agent, messages, onUsage);
    }
    return chatStream(
        messages,
        agent.systemInstruction,
        agent.vectorStoreId ?? undefined,
        agent.model,
        onUsage,
    );
}

function mockStream(
    agent: ResolvedAgent,
    messages: AgentMessage[],
    onUsage?: (usage: TokenUsage) => void,
): ReadableStream<Uint8Array> {
    const last = messages[messages.length - 1]?.content ?? "";
    const reply = `[mock:${agent.model}] received ${messages.length} message(s). echo: ${last}`;
    const chunks = reply.match(/[\s\S]{1,24}/g) ?? [reply];
    let i = 0;
    return new ReadableStream({
        pull(controller) {
            if (i < chunks.length) {
                controller.enqueue(encoder.encode(chunks[i++]));
            } else {
                if (onUsage) {
                    // Rough estimate (~4 chars/token) so dev metrics aren't empty.
                    const inChars = messages.reduce((n, m) => n + m.content.length, 0);
                    const inputTokens = Math.ceil(inChars / 4);
                    const outputTokens = Math.ceil(reply.length / 4);
                    onUsage({ inputTokens, outputTokens, totalTokens: inputTokens + outputTokens });
                }
                controller.close();
            }
        },
    });
}

/** Extract the client IP from proxy headers (X-Forwarded-For / X-Real-IP). */
export function extractClientIp(headers: Headers): string | null {
    const xff = headers.get("x-forwarded-for");
    if (xff) return xff.split(",")[0].trim() || null;
    return headers.get("x-real-ip");
}

/**
 * Record one Agent API request for usage analytics. Fire-and-forget — never
 * awaited, so it can't add latency to the response; failures are swallowed.
 */
export function logApiUsage(entry: {
    apiKeyId: string;
    assistantId?: string | null;
    ip?: string | null;
    status: number;
    inputTokens?: number;
    outputTokens?: number;
    totalTokens?: number;
}): void {
    prisma.apiKeyUsage
        .create({
            data: {
                apiKeyId: entry.apiKeyId,
                assistantId: entry.assistantId ?? null,
                ip: entry.ip ?? null,
                status: entry.status,
                inputTokens: entry.inputTokens ?? 0,
                outputTokens: entry.outputTokens ?? 0,
                totalTokens: entry.totalTokens ?? 0,
            },
        })
        .catch(() => {});
}

// ============================================================
// AGORA — custom-LLM surface for Agora.io Conversational AI (/api/agora/*)
//
// Agora's Conversational AI Engine calls a "custom LLM" over plain HTTP and
// requires it to speak OpenAI's Chat Completions protocol, streaming back
// `chat.completion.chunk` events over SSE and terminating with `data: [DONE]`.
// (See Agora's own reference server, which forwards OpenAI's chunk verbatim:
// https://github.com/AgoraIO-Community/agora-convo-ai-custom-llm-express)
//
// So these endpoints are exactly OpenAI-compatible — which also means any
// stock OpenAI SDK works against them by changing only the base URL.
//
// Auth and the DB-driven permission model are the same as the v1 endpoint.
// The target assistant is chosen via the request body's `model` field (its id
// or slug) rather than the URL, because that is the only per-request knob
// Agora exposes (`llm.params.model` in the agent's start config).
//
// Beyond OpenAI's fields, Agora also sends `appId`, `channel` and `userId`.
// We accept and surface them for diagnostics but don't act on them: this
// server has no RTM/tool-calling integration, so there is nothing to route.
// ============================================================

/** A fresh OpenAI-style completion id, e.g. `chatcmpl-ab12…`. */
export function newCompletionId(): string {
    return `chatcmpl-${randomBytes(16).toString("hex")}`;
}

/**
 * The non-OpenAI fields Agora adds to the request body. Present only when the
 * caller is Agora's Conversational AI Engine; absent for a plain OpenAI SDK.
 */
export type AgoraContext = {
    appId: string | null;
    channel: string | null;
    userId: string | null;
};

/** Successful preflight for an AGORA request; everything the handler needs. */
export type OpenAiPrep = {
    ok: true;
    apiKeyId: string;
    ip: string | null;
    agent: ResolvedAgent;
    messages: AgentMessage[];
    model: string;
    stream: boolean;
    agora: AgoraContext;
};

/** Read an optional string field, normalizing empty/absent/non-string to null. */
function optionalString(value: unknown): string | null {
    return typeof value === "string" && value.trim() ? value.trim() : null;
}

/**
 * Shared preflight for the AGORA endpoints: auth → parse body → resolve the
 * agent from `model` → permission check → normalize messages. Any rejection
 * that can be attributed to a valid key is metered (like the v1 path). On
 * success, returns everything the two handlers need; on failure, a status +
 * error for the caller to serialize as JSON.
 */
export async function prepareOpenAiRequest(
    request: Request,
): Promise<OpenAiPrep | { ok: false; status: number; error: string }> {
    const rawKey = extractApiKey(request.headers);
    if (!rawKey) return { ok: false, status: 401, error: "Missing API key" };

    const ip = extractClientIp(request.headers);

    let body: unknown;
    try {
        body = await request.json();
    } catch {
        return { ok: false, status: 400, error: "Invalid JSON body" };
    }

    const b = body as {
        model?: unknown;
        stream?: unknown;
        appId?: unknown;
        channel?: unknown;
        userId?: unknown;
    };
    const model = typeof b.model === "string" ? b.model.trim() : "";
    if (!model) {
        return {
            ok: false,
            status: 400,
            error: "Missing 'model' — set it to the agent id or slug",
        };
    }

    const agora: AgoraContext = {
        appId: optionalString(b.appId),
        channel: optionalString(b.channel),
        userId: optionalString(b.userId),
    };

    // Independent lookups in parallel; key errors take precedence over agent
    // errors and aren't metered (no key to attribute the call to).
    const [keyResult, agentResult] = await Promise.all([
        verifyApiKey(rawKey),
        resolveAgent(model),
    ]);
    if (!keyResult.ok) return { ok: false, status: keyResult.status, error: keyResult.error };
    const apiKeyId = keyResult.apiKeyId;

    if (!agentResult.ok) {
        logApiUsage({ apiKeyId, ip, status: agentResult.status });
        return { ok: false, status: agentResult.status, error: agentResult.error };
    }
    const agent = agentResult.agent;

    if (!keyResult.allowed.has(agent.assistantId)) {
        logApiUsage({ apiKeyId, assistantId: agent.assistantId, ip, status: 403 });
        return { ok: false, status: 403, error: "API key is not permitted to access this agent" };
    }

    const messages = toAgentMessages(body);
    if (messages.length === 0) {
        logApiUsage({ apiKeyId, assistantId: agent.assistantId, ip, status: 400 });
        return { ok: false, status: 400, error: "No messages provided" };
    }

    return { ok: true, apiKeyId, ip, agent, messages, model, stream: b.stream === true, agora };
}

/**
 * Non-streaming path: drain the model's text stream into a single string,
 * capturing the token usage reported when the stream completes.
 */
export async function collectAgentResponse(
    agent: ResolvedAgent,
    messages: AgentMessage[],
): Promise<{ text: string; usage: TokenUsage }> {
    let usage: TokenUsage = { inputTokens: 0, outputTokens: 0, totalTokens: 0 };
    const stream = await streamAgentResponse(agent, messages, (u) => {
        usage = u;
    });
    const reader = stream.getReader();
    const decoder = new TextDecoder();
    let text = "";
    for (;;) {
        const { value, done } = await reader.read();
        if (done) break;
        text += decoder.decode(value, { stream: true });
    }
    text += decoder.decode();
    return { text, usage };
}

/**
 * Wrap a raw UTF-8 text stream as OpenAI `chat.completion.chunk` SSE events:
 * an initial `{role:"assistant"}` delta, one `{content:"…"}` delta per source
 * chunk, a final `finish_reason:"stop"` delta, then `data: [DONE]`. `onFlush`
 * fires after the last event (used to meter usage without blocking the stream).
 */
export function openAiSseTransform(opts: {
    id: string;
    created: number;
    model: string;
    onFlush?: () => void;
}): TransformStream<Uint8Array, Uint8Array> {
    const decoder = new TextDecoder();
    const chunk = (delta: object, finish: string | null) =>
        encoder.encode(
            `data: ${JSON.stringify({
                id: opts.id,
                object: "chat.completion.chunk",
                created: opts.created,
                model: opts.model,
                choices: [{ index: 0, delta, finish_reason: finish }],
            })}\n\n`,
        );

    return new TransformStream<Uint8Array, Uint8Array>({
        start(controller) {
            controller.enqueue(chunk({ role: "assistant" }, null));
        },
        transform(bytes, controller) {
            const text = decoder.decode(bytes, { stream: true });
            if (text) controller.enqueue(chunk({ content: text }, null));
        },
        flush(controller) {
            controller.enqueue(chunk({}, "stop"));
            controller.enqueue(encoder.encode("data: [DONE]\n\n"));
            opts.onFlush?.();
        },
    });
}

