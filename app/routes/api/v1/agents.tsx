import {
    extractApiKey,
    extractClientIp,
    logApiUsage,
    resolveAgent,
    streamAgentResponse,
    toAgentMessages,
    verifyApiKey,
} from "~/lib/agent-api.server";
import type { TokenUsage } from "~/lib/openai.server";

/**
 * POST /api/v1/agents/:agent
 *
 * External, session-less entry point for invoking an Assistant.
 * `:agent` is the assistant's id or slug.
 * Auth: `Authorization: Bearer <key>` (or `x-api-key: <key>`).
 * Body: `{ "messages": [{ "role": "user", "content": "..." }] }`
 *       or `{ "message": "..." }`.
 * Response: streamed UTF-8 text (same shape as /api/chat).
 */

function jsonError(message: string, status: number): Response {
    return new Response(JSON.stringify({ error: message }), {
        status,
        headers: { "Content-Type": "application/json" },
    });
}

export async function action({
    request,
    params,
}: {
    request: Request;
    params: { agent: string };
}) {
    if (request.method !== "POST") {
        return jsonError("Method not allowed", 405);
    }

    const rawKey = extractApiKey(request.headers);
    if (!rawKey) {
        return jsonError("Missing API key", 401);
    }

    const ip = extractClientIp(request.headers);

    // Independent lookups — run them together to save a round-trip. Key errors
    // take precedence over agent errors.
    const [keyResult, agentResult] = await Promise.all([
        verifyApiKey(rawKey),
        resolveAgent(params.agent),
    ]);
    // Unknown/revoked keys aren't metered (no key to attribute the call to).
    if (!keyResult.ok) {
        return jsonError(keyResult.error, keyResult.status);
    }
    const apiKeyId = keyResult.apiKeyId;

    if (!agentResult.ok) {
        logApiUsage({ apiKeyId, ip, status: agentResult.status });
        return jsonError(agentResult.error, agentResult.status);
    }
    const agent = agentResult.agent;

    // Permission: the key must be linked to this assistant (DB-driven).
    if (!keyResult.allowed.has(agent.assistantId)) {
        logApiUsage({ apiKeyId, assistantId: agent.assistantId, ip, status: 403 });
        return jsonError("API key is not permitted to access this agent", 403);
    }

    let body: unknown;
    try {
        body = await request.json();
    } catch {
        logApiUsage({ apiKeyId, assistantId: agent.assistantId, ip, status: 400 });
        return jsonError("Invalid JSON body", 400);
    }

    const messages = toAgentMessages(body);
    if (messages.length === 0) {
        logApiUsage({ apiKeyId, assistantId: agent.assistantId, ip, status: 400 });
        return jsonError("No messages provided", 400);
    }

    try {
        // Capture token usage reported when the stream completes, then log the
        // request (with tokens) once the client has drained the stream.
        let usage: TokenUsage = { inputTokens: 0, outputTokens: 0, totalTokens: 0 };
        const stream = await streamAgentResponse(agent, messages, (u) => {
            usage = u;
        });
        const metered = stream.pipeThrough(
            new TransformStream({
                transform(chunk, controller) {
                    controller.enqueue(chunk);
                },
                flush() {
                    logApiUsage({
                        apiKeyId,
                        assistantId: agent.assistantId,
                        ip,
                        status: 200,
                        ...usage,
                    });
                },
            }),
        );
        return new Response(metered, {
            headers: {
                "Content-Type": "text/plain; charset=utf-8",
                "Transfer-Encoding": "chunked",
                "Cache-Control": "no-cache",
                // Disable proxy buffering (e.g. nginx) so chunks flush in realtime.
                "X-Accel-Buffering": "no",
            },
        });
    } catch (error) {
        logApiUsage({ apiKeyId, assistantId: agent.assistantId, ip, status: 500 });
        console.error("Agent API error:", error);
        return jsonError("Internal server error", 500);
    }
}

// Resource route: GET has no meaning here. Reject it explicitly.
export async function loader() {
    return jsonError("Method not allowed", 405);
}
