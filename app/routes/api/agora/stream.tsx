import {
    logApiUsage,
    newCompletionId,
    openAiSseTransform,
    prepareOpenAiRequest,
    streamAgentResponse,
} from "~/lib/agent-api.server";
import type { TokenUsage } from "~/lib/openai.server";

/**
 * AGORA — POST /api/agora/stream
 *
 * Same contract as /api/agora/chat/completions, except the response is *always*
 * an SSE stream: the request body's `stream` flag is ignored. Point Agora's
 * `llm.url` here when you want to guarantee streaming without depending on the
 * engine setting `stream: true` itself.
 *
 * The wire format is OpenAI's `chat.completion.chunk`, which is what Agora's
 * Conversational AI Engine parses — an `id`/`object`/`created`/`model` envelope
 * around `choices[0].delta`, closed by `finish_reason:"stop"` and `data: [DONE]`.
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
    const { apiKeyId, ip, agent, messages, model, agora } = prep;

    try {
        let usage: TokenUsage = { inputTokens: 0, outputTokens: 0, totalTokens: 0 };
        // Keep spoken replies short so Agora's History API never truncates them.
        const raw = await streamAgentResponse(agent, messages, (u) => {
            usage = u;
        }, 220);
        const sse = raw.pipeThrough(
            openAiSseTransform({
                id: newCompletionId(),
                created: Math.floor(Date.now() / 1000),
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
        console.error("AGORA stream error:", { channel: agora.channel, error });
        return jsonError("Internal server error", 500);
    }
}

// Resource route: GET has no meaning here. Reject it explicitly.
export async function loader() {
    return jsonError("Method not allowed", 405);
}
