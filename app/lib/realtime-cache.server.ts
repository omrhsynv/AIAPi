import { createHash } from "node:crypto";
import { prisma } from "./db.server";
import { getOpenAI } from "./openai.server";

/**
 * Shared response cache (multiplayer cost control).
 *
 * The expensive part of an NPC turn is the GPT+RAG completion and the ElevenLabs
 * synthesis. In multiplayer, many players ask the SAME NPC the SAME things
 * ("şirket ne hakkında?"). This cache answers those from Postgres instead:
 *
 *   1. Exact tier  — normalized question match. Zero token spend.
 *   2. Semantic tier — embed the question (~1000x cheaper than a RAG completion)
 *      and cosine-match against cached questions for this NPC. Catches
 *      paraphrases / "similar" questions.
 *
 * The cache is keyed by CHARACTER, not player, so it is shared across everyone
 * talking to that NPC. Answers, ElevenLabs audio, and translations are all
 * cached, so a repeated question costs nothing downstream either.
 */

const CACHE_ENABLED = String(process.env.REALTIME_CACHE_ENABLED ?? "true").toLowerCase() !== "false";
const SEMANTIC_ENABLED = String(process.env.REALTIME_CACHE_SEMANTIC ?? "true").toLowerCase() !== "false";
// Calibrated for text-embedding-3-small on Turkish: same-intent paraphrases
// score ~0.58–0.87, different-topic questions to the same NPC ~0.34–0.40, and
// unrelated ~0.26. 0.50 sits in the gap — catches "similar" without false hits.
const SIMILARITY_THRESHOLD = Number(process.env.REALTIME_CACHE_SIMILARITY || 0.5);
const MIN_QUESTION_LEN = Number(process.env.REALTIME_CACHE_MIN_QUESTION_LEN || 8);
const SEMANTIC_CANDIDATE_LIMIT = Number(process.env.REALTIME_CACHE_CANDIDATES || 100);
const EMBED_MODEL = process.env.REALTIME_CACHE_EMBED_MODEL || "text-embedding-3-small";

export type CacheKeyParts = { orgId: string; gameId: string; characterId: string };

/** Turkish-aware normalization for the exact-match key. */
export function normalizeQuestion(text: string): string {
    return String(text || "")
        .toLocaleLowerCase("tr-TR")
        .replace(/[.,!?;:"'`´()\[\]{}<>»«…]/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}

export function isCacheable(question: string): boolean {
    if (!CACHE_ENABLED) return false;
    const norm = normalizeQuestion(question);
    // Skip ultra-short questions ("evet", "peki") — likely context-dependent.
    return norm.length >= MIN_QUESTION_LEN;
}

function sha(input: string): string {
    return createHash("sha256").update(input).digest("hex");
}

async function embed(text: string): Promise<number[] | null> {
    if (!SEMANTIC_ENABLED || !process.env.OPENAI_API_KEY) return null;
    try {
        const openai = getOpenAI();
        const res = await openai.embeddings.create({ model: EMBED_MODEL, input: text.slice(0, 2000) });
        return res.data[0]?.embedding ?? null;
    } catch {
        return null;
    }
}

function cosine(a: number[], b: number[]): number {
    if (a.length !== b.length) return 0;
    let dot = 0, na = 0, nb = 0;
    for (let i = 0; i < a.length; i++) {
        dot += a[i] * b[i];
        na += a[i] * a[i];
        nb += b[i] * b[i];
    }
    if (na === 0 || nb === 0) return 0;
    return dot / (Math.sqrt(na) * Math.sqrt(nb));
}

export type CacheHit = { answer: string; via: "exact" | "semantic"; id: string };

/** Look up a cached answer for this NPC. Returns null on miss. */
export async function lookupAnswer(key: CacheKeyParts, question: string): Promise<CacheHit | null> {
    if (!isCacheable(question)) return null;
    const questionNorm = normalizeQuestion(question);

    try {
        // Tier 1: exact normalized match (free).
        const exact = await prisma.realtimeResponseCache.findUnique({
            where: {
                orgId_gameId_characterId_questionNorm: {
                    orgId: key.orgId, gameId: key.gameId, characterId: key.characterId, questionNorm,
                },
            },
        });
        if (exact) {
            bumpHit(exact.id);
            return { answer: exact.answer, via: "exact", id: exact.id };
        }

        // Tier 2: semantic match against this NPC's cached questions.
        if (!SEMANTIC_ENABLED) return null;
        const queryVec = await embed(question);
        if (!queryVec) return null;

        const candidates = await prisma.realtimeResponseCache.findMany({
            where: { orgId: key.orgId, gameId: key.gameId, characterId: key.characterId, embedding: { not: null } },
            orderBy: { hitCount: "desc" },
            take: SEMANTIC_CANDIDATE_LIMIT,
            select: { id: true, answer: true, embedding: true },
        });

        let best: { id: string; answer: string; score: number } | null = null;
        for (const row of candidates) {
            if (!row.embedding) continue;
            let vec: number[];
            try { vec = JSON.parse(row.embedding); } catch { continue; }
            const score = cosine(queryVec, vec);
            if (!best || score > best.score) best = { id: row.id, answer: row.answer, score };
        }

        if (best && best.score >= SIMILARITY_THRESHOLD) {
            bumpHit(best.id);
            return { answer: best.answer, via: "semantic", id: best.id };
        }
        return null;
    } catch {
        return null; // cache must never break the turn
    }
}

/** Store a freshly-generated answer (with its embedding for future matches). */
export async function storeAnswer(key: CacheKeyParts, question: string, answer: string): Promise<void> {
    if (!isCacheable(question) || !answer.trim()) return;
    const questionNorm = normalizeQuestion(question);
    const vec = await embed(question);
    try {
        await prisma.realtimeResponseCache.upsert({
            where: {
                orgId_gameId_characterId_questionNorm: {
                    orgId: key.orgId, gameId: key.gameId, characterId: key.characterId, questionNorm,
                },
            },
            create: {
                orgId: key.orgId, gameId: key.gameId, characterId: key.characterId,
                questionNorm, question, answer, embedding: vec ? JSON.stringify(vec) : null,
            },
            update: { answer, embedding: vec ? JSON.stringify(vec) : undefined, lastUsedAt: new Date() },
        });
    } catch {
        /* never break the turn */
    }
}

function bumpHit(id: string): void {
    prisma.realtimeResponseCache
        .update({ where: { id }, data: { hitCount: { increment: 1 }, lastUsedAt: new Date() } })
        .catch(() => null);
}

// ── ElevenLabs audio cache (reuse audio for identical answers) ───────────────

export async function lookupTts(voiceId: string, text: string): Promise<Buffer | null> {
    if (!CACHE_ENABLED) return null;
    try {
        const row = await prisma.realtimeTtsCache.findUnique({ where: { cacheKey: sha(`${voiceId}\n${text}`) } });
        if (!row) return null;
        prisma.realtimeTtsCache.update({ where: { id: row.id }, data: { hitCount: { increment: 1 }, lastUsedAt: new Date() } }).catch(() => null);
        return Buffer.from(row.audio);
    } catch {
        return null;
    }
}

export async function storeTts(voiceId: string, text: string, audio: Buffer): Promise<void> {
    if (!CACHE_ENABLED || audio.length === 0) return;
    try {
        await prisma.realtimeTtsCache.upsert({
            where: { cacheKey: sha(`${voiceId}\n${text}`) },
            create: { cacheKey: sha(`${voiceId}\n${text}`), voiceId, audio },
            update: { lastUsedAt: new Date() },
        });
    } catch {
        /* ignore */
    }
}

// ── Translation cache (reuse translations of identical answers) ──────────────

export async function lookupTranslation(targetLocale: string, sourceText: string): Promise<string | null> {
    if (!CACHE_ENABLED) return null;
    try {
        const row = await prisma.realtimeTranslationCache.findUnique({ where: { cacheKey: sha(`${targetLocale}\n${sourceText}`) } });
        if (!row) return null;
        prisma.realtimeTranslationCache.update({ where: { id: row.id }, data: { hitCount: { increment: 1 }, lastUsedAt: new Date() } }).catch(() => null);
        return row.translated;
    } catch {
        return null;
    }
}

export async function storeTranslation(targetLocale: string, sourceText: string, translated: string): Promise<void> {
    if (!CACHE_ENABLED || !translated.trim()) return;
    try {
        await prisma.realtimeTranslationCache.upsert({
            where: { cacheKey: sha(`${targetLocale}\n${sourceText}`) },
            create: { cacheKey: sha(`${targetLocale}\n${sourceText}`), targetLocale, sourceText, translated },
            update: { lastUsedAt: new Date() },
        });
    } catch {
        /* ignore */
    }
}
