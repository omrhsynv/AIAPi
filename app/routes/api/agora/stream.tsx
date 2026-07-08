import {
    agoraSseTransform,
    logApiUsage,
    prepareOpenAiRequest,
    streamAgentResponse,
} from "~/lib/agent-api.server";
import type { TokenUsage } from "~/lib/openai.server";

/**
 * AGORA — POST /api/agora/stream  (Agora.io)
 *
 * Dedicated streaming endpoint that emits the minimal Agora.io SSE shape:
 * one delta-content line per chunk, ending with `data: [DONE]`.
 *
 *   data: {"choices":[{"delta":{"content":"Merhaba, "}}]}
 *   data: {"choices":[{"delta":{"content":"nasıl "}}]}
 *   data: {"choices":[{"delta":{"content":"yardımcı olabilirim?"}}]}
 *   data: [DONE]
 *
 * (For the full OpenAI `chat.completion.chunk` envelope, use
 * /api/agora/chat/completions with `stream: true`.)
 *
 * Auth and permissions are identical to /api/agora/chat/completions; the target
 * assistant is chosen via the body's `model` field (id or slug).
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
    const { apiKeyId, ip, agent, messages } = prep;

    try {
        let usage: TokenUsage = { inputTokens: 0, outputTokens: 0, totalTokens: 0 };
        const raw = await streamAgentResponse(agent, messages, (u) => {
            usage = u;
        });
        const sse = raw.pipeThrough(
            agoraSseTransform({
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

// Resource route: GET has no meaning here. Reject it explicitly.
export async function loader() {
    return jsonError("Method not allowed", 405);
}
