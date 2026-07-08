import {
    collectAgentResponse,
    logApiUsage,
    newCompletionId,
    openAiSseTransform,
    prepareOpenAiRequest,
    streamAgentResponse,
} from "~/lib/agent-api.server";
import type { TokenUsage } from "~/lib/openai.server";

/**
 * AGORA — POST /api/agora/chat/completions
 *
 * OpenAI-compatible Chat Completions endpoint. Point an OpenAI client at this
 * URL, set `model` to an assistant's id or slug, and it just works.
 *
 * Auth:   `Authorization: Bearer <key>` (or `x-api-key: <key>`).
 * Body:   `{ "model": "<agent>", "messages": [{ "role": "user", "content": "…" }], "stream"?: bool }`
 * Reply:  `stream:false` (default) → a `chat.completion` JSON object.
 *         `stream:true`            → `chat.completion.chunk` SSE events + `[DONE]`.
 *
 * The assistant's own system instruction is always used; any `system` message
 * in the body is ignored (only `user`/`assistant` turns are forwarded).
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

    const prep = await prepareOpenAiRequest(request);
    if (!prep.ok) {
        return jsonError(prep.error, prep.status);
    }
    const { apiKeyId, ip, agent, messages, model, stream } = prep;
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
                    onFlush: () =>
                        logApiUsage({
                            apiKeyId,
                            assistantId: agent.assistantId,
                            ip,
                            status: 200,
                            ...usage,
                        }),
                }),
            );
            return new Response(sse, { headers: SSE_HEADERS });
        } catch (error) {
            logApiUsage({ apiKeyId, assistantId: agent.assistantId, ip, status: 500 });
            console.error("AGORA stream error:", error);
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
        console.error("AGORA error:", error);
        return jsonError("Internal server error", 500);
    }
}

// Resource route: GET has no meaning here. Reject it explicitly.
export async function loader() {
    return jsonError("Method not allowed", 405);
}
