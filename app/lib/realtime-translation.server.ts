import { prisma } from "./db.server";
import { getOpenAI } from "./openai.server";
import { lookupTranslation, storeTranslation } from "./realtime-cache.server";

/**
 * Live translation (Phase 5) — ported from the Aris888 platform's
 * liveTranslationService, adapted to Prisma + the AIAPi OpenAI singleton.
 *
 * The NPC reasons in ONE canonical locale (REALTIME_CANONICAL_LOCALE, default
 * tr-TR — the assistants' system prompts force Turkish). Players in other
 * locales get `translation.final` events alongside the canonical
 * `response.final`, including "party mode": one answer fanned out to every
 * locale the session subscribed to.
 *
 * Glossary locks: per-(org, game) protected terms (skill/map/faction names)
 * are force-replaced after translation so they render identically everywhere.
 *
 * Mock/passthrough: same-locale requests, REALTIME_TRANSLATION_MOCK_MODE=true,
 * or a missing OPENAI_API_KEY all short-circuit without provider spend.
 */

export const CANONICAL_LOCALE = (process.env.REALTIME_CANONICAL_LOCALE || "tr-TR").trim();
const TRANSLATION_MODEL = process.env.REALTIME_TRANSLATION_MODEL || "gpt-4.1-mini";
const MAX_PARTY_LOCALES = 6;

export type Translation = {
    text: string;
    sourceLocale: string;
    targetLocale: string;
    provider: "openai" | "passthrough" | "mock";
    glossaryApplied: string[];
};

export function normalizeLocale(locale: string | null | undefined): string {
    const raw = String(locale ?? "").trim();
    if (!raw) return "";
    const parts = raw.replace("_", "-").split("-");
    if (parts.length >= 2) return parts[0].toLowerCase() + "-" + parts[1].toUpperCase();
    return parts[0].toLowerCase();
}

function sameLanguage(a: string, b: string): boolean {
    const la = normalizeLocale(a).split("-")[0];
    const lb = normalizeLocale(b).split("-")[0];
    return !!la && la === lb;
}

export function normalizePartyLocales(input: unknown): string[] {
    if (!Array.isArray(input)) return [];
    const seen = new Set<string>();
    const out: string[] = [];
    for (const raw of input) {
        const locale = normalizeLocale(String(raw ?? ""));
        if (!locale || seen.has(locale)) continue;
        seen.add(locale);
        out.push(locale);
        if (out.length >= MAX_PARTY_LOCALES) break;
    }
    return out;
}

function isMockMode(): boolean {
    return (
        String(process.env.REALTIME_TRANSLATION_MOCK_MODE || process.env.REALTIME_LOAD_TEST_MODE || "").toLowerCase() === "true" ||
        !process.env.OPENAI_API_KEY
    );
}

async function listGlossaryTerms(orgId: string, gameId: string, targetLocale: string) {
    return prisma.realtimeGlossaryTerm.findMany({
        where: { orgId, gameId, locale: { in: [targetLocale, "*"] } },
        take: 100,
    });
}

function applyGlossaryLocks(text: string, terms: { sourceTerm: string; targetTerm: string }[]): { text: string; applied: string[] } {
    let output = text;
    const applied: string[] = [];
    for (const term of terms) {
        if (!term.sourceTerm) continue;
        const pattern = new RegExp(term.sourceTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi");
        if (pattern.test(output)) {
            output = output.replace(pattern, term.targetTerm);
            applied.push(term.sourceTerm);
        }
    }
    return { text: output, applied };
}

async function translateWithOpenAi(text: string, sourceLocale: string, targetLocale: string, glossary: { sourceTerm: string; targetTerm: string }[]): Promise<string> {
    const openai = getOpenAI();
    const locks = glossary.length
        ? `\nTerminology locks (must appear verbatim): ${glossary.map((t) => `${t.sourceTerm} => ${t.targetTerm}`).join("; ")}`
        : "";
    const response = await openai.chat.completions.create({
        model: TRANSLATION_MODEL,
        messages: [
            {
                role: "system",
                content: `Translate from ${sourceLocale} to ${targetLocale}. Preserve meaning, tone, and names. Return ONLY the translated text, nothing else.${locks}`,
            },
            { role: "user", content: text },
        ],
        max_tokens: 400,
    });
    return (response.choices[0]?.message?.content || "").trim() || text;
}

/** Translate one text. Short-circuits on same language / mock mode. */
export async function translateText(params: {
    text: string;
    sourceLocale: string;
    targetLocale: string;
    orgId: string;
    gameId: string;
}): Promise<Translation> {
    const sourceLocale = normalizeLocale(params.sourceLocale) || CANONICAL_LOCALE;
    const targetLocale = normalizeLocale(params.targetLocale);
    const text = String(params.text || "").trim();

    if (!text || !targetLocale || sameLanguage(sourceLocale, targetLocale)) {
        return { text, sourceLocale, targetLocale: targetLocale || sourceLocale, provider: "passthrough", glossaryApplied: [] };
    }

    // Shared cache: the same answer translated to the same locale is reused
    // across players (repeated answers come from the response cache verbatim).
    const cached = await lookupTranslation(targetLocale, text);
    if (cached) {
        return { text: cached, sourceLocale, targetLocale, provider: "passthrough", glossaryApplied: [] };
    }

    const terms = await listGlossaryTerms(params.orgId, params.gameId, targetLocale).catch(() => []);

    if (isMockMode()) {
        const locked = applyGlossaryLocks(text, terms);
        return { text: `[${targetLocale}] ${locked.text}`, sourceLocale, targetLocale, provider: "mock", glossaryApplied: locked.applied };
    }

    try {
        const translated = await translateWithOpenAi(text, sourceLocale, targetLocale, terms);
        const locked = applyGlossaryLocks(translated, terms);
        storeTranslation(targetLocale, text, locked.text).catch(() => null);
        return { text: locked.text, sourceLocale, targetLocale, provider: "openai", glossaryApplied: locked.applied };
    } catch {
        // Degrade to passthrough rather than failing the turn.
        return { text, sourceLocale, targetLocale, provider: "passthrough", glossaryApplied: [] };
    }
}

type SendFn = (type: string, payload: object) => void;

/**
 * Fan the canonical answer out as `translation.final` events: one for the
 * player's own locale (if it differs) and one per party locale. Failures are
 * swallowed — translation must never break the turn.
 */
export async function emitTranslations(opts: {
    send: SendFn;
    turnId: string;
    text: string;
    orgId: string;
    gameId: string;
    playerLocale: string;
    partyLocales: string[];
}): Promise<void> {
    const targets = new Set<string>();
    const player = normalizeLocale(opts.playerLocale);
    if (player && !sameLanguage(player, CANONICAL_LOCALE)) targets.add(player);
    for (const locale of opts.partyLocales) {
        if (!sameLanguage(locale, CANONICAL_LOCALE)) targets.add(locale);
    }
    if (targets.size === 0) return;

    await Promise.all(
        Array.from(targets).map(async (targetLocale) => {
            try {
                const translation = await translateText({
                    text: opts.text,
                    sourceLocale: CANONICAL_LOCALE,
                    targetLocale,
                    orgId: opts.orgId,
                    gameId: opts.gameId,
                });
                opts.send("translation.final", {
                    turnId: opts.turnId,
                    text: translation.text,
                    sourceLocale: translation.sourceLocale,
                    targetLocale: translation.targetLocale,
                    direction: targetLocale === player ? "outbound" : "party",
                    glossaryApplied: translation.glossaryApplied,
                });
            } catch {
                /* never break the turn */
            }
        }),
    );
}
