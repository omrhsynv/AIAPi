import {
    extractApiKey,
    resolveAgent,
    streamAgentResponse,
    toAgentMessages,
    verifyApiKey,
} from "~/lib/agent-api.server";

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

    // Independent lookups — run them together to save a round-trip. Key errors
    // take precedence over agent errors.
    const [keyResult, agentResult] = await Promise.all([
        verifyApiKey(rawKey),
        resolveAgent(params.agent),
    ]);
    if (!keyResult.ok) {
        return jsonError(keyResult.error, keyResult.status);
    }
    if (!agentResult.ok) {
        return jsonError(agentResult.error, agentResult.status);
    }
    const agent = agentResult.agent;

    // Permission: the key must be linked to this assistant (DB-driven).
    if (!keyResult.allowed.has(agent.assistantId)) {
        return jsonError("API key is not permitted to access this agent", 403);
    }

    let body: unknown;
    try {
        body = await request.json();
    } catch {
        return jsonError("Invalid JSON body", 400);
    }

    const messages = toAgentMessages(body);
    if (messages.length === 0) {
        return jsonError("No messages provided", 400);
    }

    try {
        const stream = await streamAgentResponse(agent, messages);
        return new Response(stream, {
            headers: {
                "Content-Type": "text/plain; charset=utf-8",
                "Transfer-Encoding": "chunked",
                "Cache-Control": "no-cache",
                // Disable proxy buffering (e.g. nginx) so chunks flush in realtime.
                "X-Accel-Buffering": "no",
            },
        });
    } catch (error) {
        console.error("Agent API error:", error);
        return jsonError("Internal server error", 500);
    }
}

// Resource route: GET has no meaning here. Reject it explicitly.
export async function loader() {
    return jsonError("Method not allowed", 405);
}
