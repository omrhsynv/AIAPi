import { timingSafeEqual } from "node:crypto";
import { prisma } from "~/lib/db.server";

/**
 * GET /api/realtime/stats — operational snapshot for the realtime NPC system.
 * Auth: X-Realtime-Service-Key (trusted servers / dashboards only).
 *
 * Returns active session count, today's turn volume + failure count, and
 * average turn latency — the minimum needed to watch the rollout without a
 * full Prometheus stack.
 */

function jsonError(message: string, status: number): Response {
    return Response.json({ error: message }, { status });
}

function safeEqual(a: string, b: string): boolean {
    const ab = Buffer.from(a);
    const bb = Buffer.from(b);
    if (ab.length !== bb.length) return false;
    return timingSafeEqual(ab, bb);
}

export async function loader({ request }: { request: Request }) {
    const serviceKey = process.env.REALTIME_GAME_SERVER_API_KEY?.trim();
    if (!serviceKey) return jsonError("Not configured", 503);

    const provided = request.headers.get("x-realtime-service-key")?.trim() || "";
    if (!provided || !safeEqual(provided, serviceKey)) {
        return jsonError("Invalid or missing service key", 401);
    }

    const dayStart = new Date();
    dayStart.setHours(0, 0, 0, 0);

    const [activeSessions, sessionsToday, turnsToday, failedToday, tokenAgg] = await Promise.all([
        prisma.realtimeSession.count({ where: { state: { in: ["active", "interrupted"] } } }),
        prisma.realtimeSession.count({ where: { startedAt: { gte: dayStart } } }),
        prisma.realtimeTurn.count({ where: { createdAt: { gte: dayStart } } }),
        prisma.realtimeTurn.count({ where: { createdAt: { gte: dayStart }, state: "failed" } }),
        prisma.realtimeTurn.aggregate({
            where: { createdAt: { gte: dayStart }, state: "completed" },
            _sum: { inputTokens: true, outputTokens: true },
        }),
    ]);

    // Average completed-turn latency today (completedAt - createdAt).
    const recent = await prisma.realtimeTurn.findMany({
        where: { createdAt: { gte: dayStart }, state: "completed", completedAt: { not: null } },
        select: { createdAt: true, completedAt: true },
        orderBy: { createdAt: "desc" },
        take: 200,
    });
    const latencies = recent
        .map((t) => (t.completedAt ? t.completedAt.getTime() - t.createdAt.getTime() : 0))
        .filter((ms) => ms > 0)
        .sort((a, b) => a - b);
    const avgMs = latencies.length ? Math.round(latencies.reduce((a, b) => a + b, 0) / latencies.length) : null;
    const p95Ms = latencies.length ? latencies[Math.min(latencies.length - 1, Math.floor(latencies.length * 0.95))] : null;

    return Response.json({
        now: new Date().toISOString(),
        activeSessions,
        today: {
            sessions: sessionsToday,
            turns: turnsToday,
            failedTurns: failedToday,
            inputTokens: tokenAgg._sum.inputTokens ?? 0,
            outputTokens: tokenAgg._sum.outputTokens ?? 0,
            turnLatency: { avgMs, p95Ms, sample: latencies.length },
        },
    });
}
