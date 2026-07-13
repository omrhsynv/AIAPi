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
    const { apiKeyId, ip, agent, messages, model, stream, agora } = prep;
    const id = newCompletionId();
    const created = Math.floor(Date.now() / 1000);

    if (stream) {
        try {
            let usage: TokenUsage = { inputTokens: 0, outputTokens: 0, totalTokens: 0 };
            const raw = await streamAgentResponse(agent, messages, (u) => {
                usage = u;
            });
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
        const { text, usage } = await collectAgentResponse(agent, messages);
        logApiUsage({
            apiKeyId,
            assistantId: agent.assistantId,
            ip,
            status: 200,
            ...usage,
        });
        await saveAgoraChat(agora, agent, messages, text);
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
