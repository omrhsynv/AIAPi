import { prisma } from "~/lib/db.server";
import {
    collectAgentResponse,
    logApiUsage,
    newCompletionId,
    openAiSseTransform,
    prepareOpenAiRequest,
    streamAgentResponse,
    type AgentMessage,
    type AgoraContext,
    type ResolvedAgent,
} from "~/lib/agent-api.server";
import type { TokenUsage } from "~/lib/openai.server";
import { lookupAnswer, storeAnswer } from "~/lib/realtime-cache.server";
import { languageNameFor } from "~/lib/agora.server";

async function saveAgoraChat(
    agora: AgoraContext,
    agent: ResolvedAgent,
    messages: AgentMessage[],
    assistantText: string
) {
    let userMessageToSave = "";
    const lastMsg = messages[messages.length - 1];
    if (lastMsg && lastMsg.role === "user") {
        userMessageToSave = lastMsg.content;
    }

    if (!agora.channel || !userMessageToSave || !assistantText) return;

    try {
        let chat = await prisma.chat.findFirst({
            where: { OR: [{ id: agora.channel }, { title: agora.channel }] }
        });

        if (!chat) {
            const adminUser = await prisma.user.findFirst({ where: { role: 'admin' } }) || await prisma.user.findFirst();
            if (adminUser) {
                chat = await prisma.chat.create({
                    data: {
                        userId: adminUser.id,
                        assistantId: agent.assistantId,
                        title: agora.channel
                    }
                });
            }
        }

        if (chat) {
            await prisma.message.create({
                data: { chatId: chat.id, role: 'user', content: userMessageToSave }
            });
            await prisma.message.create({
                data: { chatId: chat.id, role: 'assistant', content: assistantText }
            });
        }
    } catch (e) {
        console.error("Failed to save agora chat:", e);
    }
}

/**
 * AGORA — POST /api/agora/chat/completions
 *
 * The custom-LLM endpoint for Agora.io's Conversational AI Engine: set the
 * agent's `llm.url` to this URL, `llm.api_key` to an Agent API key, and
 * `llm.params.model` to an assistant's id or slug. Because Agora's contract is
 * literally OpenAI's, a stock OpenAI client works here too.
 *
 * Auth:   `Authorization: Bearer <key>` (or `x-api-key: <key>`).
 * Body:   `{ "model": "<agent>", "messages": [{ "role": "user", "content": "…" }], "stream"?: bool }`
 *         Agora additionally sends `appId`, `channel`, `userId` — accepted, unused.
 * Reply:  `stream:false` (default) → a `chat.completion` JSON object.
 *         `stream:true`            → `chat.completion.chunk` SSE events + `[DONE]`.
 *
 * The assistant's own system instruction is always used; any `system` message
 * in the body is ignored (only `user`/`assistant` turns are forwarded). That
 * covers Agora's `llm.system_messages`, which arrive as `system` turns.
 */

// Hard ceiling on the LLM reply length for the Agora voice path. ~4 short
// sentences fit well under this; the real limiter is the system prompt (see the
// assistant's systemInstruction in the DB). This is a safety net so a runaway
// answer can never grow long enough for Agora's History API to truncate it —
// which was the root cause of the "text cut off / wrong text spoken" bug.
const AGORA_MAX_OUTPUT_TOKENS = 220;

/**
 * Shared-cache helpers for the Agora path.
 *
 * The cache is keyed by the NPC (the assistant id in `model`), so every player
 * talking to that NPC shares it: the first person to ask a question pays for the
 * LLM+RAG call, everyone asking the same/similar thing afterwards is served from
 * Postgres with zero tokens.
 *
 * Only *standalone* questions are cached — if Agora sent prior conversation
 * turns, the answer may depend on that context ("peki ya o?"), so it is neither
 * looked up nor stored.
 */
function cacheScopeFor(model: string, locale: string | null) {
    return {
        orgId: process.env.REALTIME_DEFAULT_ORG_ID || "org-aris888",
        gameId: process.env.REALTIME_DEFAULT_GAME_ID || "game-metaverse",
        // Language is part of the identity of a cached answer: the semantic tier
        // matches across languages (embeddings are multilingual), so without this
        // an English speaker could be served the Turkish answer.
        characterId: locale ? `${model}#${locale}` : model,
    };
}

/**
 * Make the assistant answer in the player's language. Each player runs their own
 * agent, so in a mixed-language room the Turkish speaker gets Turkish and the
 * English speaker gets English from the same knowledge base.
 */
function localizeAgent(agent: ResolvedAgent, locale: string | null): ResolvedAgent {
    if (!locale) return agent;
    const language = languageNameFor(locale);
    return {
        ...agent,
        systemInstruction:
            `${agent.systemInstruction}\n\n` +
            `LANGUAGE RULE (overrides any language instruction above): the user is ` +
            `speaking ${language} (${locale}). Reply ONLY in ${language}.`,
    };
}

function standaloneQuestion(messages: AgentMessage[]): string | null {
    if (messages.length !== 1) return null;
    const only = messages[0];
    if (only.role !== "user") return null;
    // Never cache the empty-speech placeholder: it isn't a real question and
    // would poison the cache for every silent turn.
    if (only.content.trim() === "[No speech detected]") return null;
    return only.content;
}

const SSE_HEADERS = {
    "Content-Type": "text/event-stream; charset=utf-8",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
    // Disable proxy buffering (e.g. nginx) so events flush in realtime.
    "X-Accel-Buffering": "no",
};

function jsonError(message: string, status: number): Response {
    return new Response(JSON.stringify({ error: message }), {
        status,
        headers: { "Content-Type": "application/json" },
    });
}

export async function action({ request }: { request: Request }) {
    if (request.method !== "POST") {
        return jsonError("Method not allowed", 405);
    }

    const body = await request.clone().json().catch(() => null);
    console.log("AGORA INCOMING REQUEST BODY:", JSON.stringify(body, null, 2));

    const prep = await prepareOpenAiRequest(request);
    if (!prep.ok) {
        return jsonError(prep.error, prep.status);
    }
    const { apiKeyId, ip, agent: baseAgent, messages, model, stream, agora, locale } = prep;
    const agent = localizeAgent(baseAgent, locale);
    const id = newCompletionId();
    const created = Math.floor(Date.now() / 1000);

    // Shared cache: has another player already asked this NPC the same (or a
    // similar) question? If so, answer without spending any tokens.
    const question = standaloneQuestion(messages);
    const scope = cacheScopeFor(model, locale);
    if (question) {
        const hit = await lookupAnswer(scope, question);
        if (hit) {
            logApiUsage({ apiKeyId, assistantId: agent.assistantId, ip, status: 200 });
            saveAgoraChat(agora, agent, messages, hit.answer);
            console.log(`AGORA cache ${hit.via} hit (0 tokens):`, question.slice(0, 60));

            if (stream) {
                const encoder = new TextEncoder();
                const cachedStream = new ReadableStream<Uint8Array>({
                    start(controller) {
                        controller.enqueue(encoder.encode(hit.answer));
                        controller.close();
                    },
                });
                const sse = cachedStream.pipeThrough(openAiSseTransform({ id, created, model }));
                return new Response(sse, { headers: SSE_HEADERS });
            }

            return Response.json({
                id,
                object: "chat.completion",
                created,
                model,
                choices: [{ index: 0, message: { role: "assistant", content: hit.answer }, finish_reason: "stop" }],
                usage: { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 },
            });
        }
    }

    if (stream) {
        try {
            let usage: TokenUsage = { inputTokens: 0, outputTokens: 0, totalTokens: 0 };
            const raw = await streamAgentResponse(agent, messages, (u) => {
                usage = u;
            }, AGORA_MAX_OUTPUT_TOKENS);
            const sse = raw.pipeThrough(
                openAiSseTransform({
                    id,
                    created,
                    model,
                    onFlush: (fullText) => {
                        logApiUsage({
                            apiKeyId,
                            assistantId: agent.assistantId,
                            ip,
                            status: 200,
                            ...usage,
                        });
                        saveAgoraChat(agora, agent, messages, fullText);
                        if (question) storeAnswer(scope, question, fullText).catch(() => null);
                    },
                }),
            );
            return new Response(sse, { headers: SSE_HEADERS });
        } catch (error) {
            logApiUsage({ apiKeyId, assistantId: agent.assistantId, ip, status: 500 });
            console.error("AGORA stream error:", { channel: agora.channel, error });
            return jsonError("Internal server error", 500);
        }
    }

    try {
        const { text, usage } = await collectAgentResponse(agent, messages, AGORA_MAX_OUTPUT_TOKENS);
        logApiUsage({
            apiKeyId,
            assistantId: agent.assistantId,
            ip,
            status: 200,
            ...usage,
        });
        await saveAgoraChat(agora, agent, messages, text);
        if (question) storeAnswer(scope, question, text).catch(() => null);
        return Response.json({
            id,
            object: "chat.completion",
            created,
            model,
            choices: [
                {
                    index: 0,
                    message: { role: "assistant", content: text },
                    finish_reason: "stop",
                },
            ],
            usage: {
                prompt_tokens: usage.inputTokens,
                completion_tokens: usage.outputTokens,
                total_tokens: usage.totalTokens,
            },
        });
    } catch (error) {
        logApiUsage({ apiKeyId, assistantId: agent.assistantId, ip, status: 500 });
        console.error("AGORA error:", { channel: agora.channel, error });
        return jsonError("Internal server error", 500);
    }
}

// Resource route: GET has no meaning here. Reject it explicitly.
export async function loader() {
    return jsonError("Method not allowed", 405);
}
