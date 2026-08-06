import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Realtime session tokens — ephemeral, signed credentials handed to a game
 * client so it never has to embed long-lived provider secrets.
 *
 * Ported from the Aris888 metaverse platform's `sdkTokenContract`: a short-lived
 * HS256 JWT whose claims bind the session to one (orgId, gameId, characterId,
 * playerId). The trusted caller (a game server, or this platform for a
 * logged-in player) mints the token; the client presents it to the realtime
 * endpoints, which verify signature + expiry + claim binding before acting.
 *
 * Implemented with node:crypto (no `jsonwebtoken` dependency) so it stays
 * verifiable and dependency-light. HS256 only.
 */

export const REALTIME_TOKEN_TYPE = "realtime_session";
export const MAX_TTL_SECONDS = 3600;
export const DEFAULT_TTL_SECONDS = 900;

const REQUIRED_CLAIMS = [
    "orgId",
    "gameId",
    "characterId",
    "playerId",
    "locale",
    "ttlSeconds",
] as const;

export type RealtimeClaimsInput = {
    orgId: string;
    gameId: string;
    characterId: string;
    playerId: string;
    locale?: string;
    ttlSeconds?: number;
};

export type RealtimeClaims = {
    orgId: string;
    gameId: string;
    characterId: string;
    playerId: string;
    locale: string;
    ttlSeconds: number;
    type: typeof REALTIME_TOKEN_TYPE;
    iat: number;
    exp: number;
};

export class RealtimeAuthError extends Error {
    code: "AUTH_INVALID" | "AUTH_CLAIM_MISMATCH";
    constructor(message: string, code: "AUTH_INVALID" | "AUTH_CLAIM_MISMATCH" = "AUTH_INVALID") {
        super(message);
        this.code = code;
    }
}

function resolveSecret(explicit?: string): string {
    const secret = explicit || process.env.REALTIME_JWT_SECRET || process.env.BETTER_AUTH_SECRET;
    if (!secret) {
        throw new Error("REALTIME_JWT_SECRET is required for realtime session tokens");
    }
    return secret;
}

function base64UrlEncode(input: Buffer | string): string {
    return Buffer.from(input)
        .toString("base64")
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/g, "");
}

function base64UrlDecode(input: string): Buffer {
    const padded = input.replace(/-/g, "+").replace(/_/g, "/");
    return Buffer.from(padded, "base64");
}

function sign(data: string, secret: string): string {
    return base64UrlEncode(createHmac("sha256", secret).update(data).digest());
}

function normalizeClaims(input: RealtimeClaimsInput): Omit<RealtimeClaims, "iat" | "exp"> {
    const ttlSeconds = Math.min(
        MAX_TTL_SECONDS,
        Math.max(60, Math.floor(Number(input.ttlSeconds ?? DEFAULT_TTL_SECONDS))),
    );

    const claims = {
        orgId: String(input.orgId ?? "").trim(),
        gameId: String(input.gameId ?? "").trim(),
        characterId: String(input.characterId ?? "").trim(),
        playerId: String(input.playerId ?? "").trim(),
        locale: String(input.locale ?? "en-US").trim() || "en-US",
        ttlSeconds,
        type: REALTIME_TOKEN_TYPE as typeof REALTIME_TOKEN_TYPE,
    };

    for (const key of REQUIRED_CLAIMS) {
        if (!String((claims as Record<string, unknown>)[key] ?? "").trim()) {
            throw new RealtimeAuthError(`Missing required realtime token claim: ${key}`);
        }
    }

    return claims;
}

/** Sign a new ephemeral session token. Returns the token and its absolute expiry. */
export function signRealtimeSessionToken(
    input: RealtimeClaimsInput,
    options: { secret?: string } = {},
): { token: string; tokenType: string; expiresAt: string; claims: RealtimeClaims } {
    const claims = normalizeClaims(input);
    const secret = resolveSecret(options.secret);

    const iat = Math.floor(Date.now() / 1000);
    const exp = iat + claims.ttlSeconds;
    const fullClaims: RealtimeClaims = { ...claims, iat, exp };

    const header = base64UrlEncode(JSON.stringify({ alg: "HS256", typ: "JWT" }));
    const payload = base64UrlEncode(JSON.stringify(fullClaims));
    const signingInput = `${header}.${payload}`;
    const token = `${signingInput}.${sign(signingInput, secret)}`;

    return {
        token,
        tokenType: REALTIME_TOKEN_TYPE,
        expiresAt: new Date(exp * 1000).toISOString(),
        claims: fullClaims,
    };
}

/** Verify signature, expiry, type, and required claims. Throws RealtimeAuthError. */
export function verifyRealtimeSessionToken(
    token: string | null | undefined,
    options: { secret?: string } = {},
): RealtimeClaims {
    if (!token || typeof token !== "string") {
        throw new RealtimeAuthError("Realtime session token is required");
    }

    const parts = token.split(".");
    if (parts.length !== 3) {
        throw new RealtimeAuthError("Malformed realtime session token");
    }

    const [header, payload, signature] = parts;
    const secret = resolveSecret(options.secret);
    const expected = sign(`${header}.${payload}`, secret);

    const sigBuf = base64UrlDecode(signature);
    const expBuf = base64UrlDecode(expected);
    if (sigBuf.length !== expBuf.length || !timingSafeEqual(sigBuf, expBuf)) {
        throw new RealtimeAuthError("Realtime session token signature is invalid");
    }

    let decoded: RealtimeClaims;
    try {
        decoded = JSON.parse(base64UrlDecode(payload).toString("utf8"));
    } catch {
        throw new RealtimeAuthError("Realtime session token payload is invalid");
    }

    if (decoded.type !== REALTIME_TOKEN_TYPE) {
        throw new RealtimeAuthError("Token type must be realtime_session");
    }

    const now = Math.floor(Date.now() / 1000);
    if (!decoded.exp || decoded.exp <= now) {
        throw new RealtimeAuthError("Realtime session token is expired");
    }

    for (const key of REQUIRED_CLAIMS) {
        const value = (decoded as Record<string, unknown>)[key];
        if (value === undefined || value === null || String(value).trim() === "") {
            throw new RealtimeAuthError(`Missing required claim in token: ${key}`);
        }
    }

    return decoded;
}

/**
 * Assert the token's identity claims match the session context the client
 * declares, so a stolen token can't be replayed against a different character
 * or player. Only keys present in `context` are checked.
 */
export function assertClaimBinding(
    tokenClaims: RealtimeClaims,
    context: Partial<Pick<RealtimeClaims, "orgId" | "gameId" | "characterId" | "playerId">> = {},
): RealtimeClaims {
    const mismatches: string[] = [];
    for (const key of ["orgId", "gameId", "characterId", "playerId"] as const) {
        if (context[key] && String(context[key]) !== String(tokenClaims[key])) {
            mismatches.push(key);
        }
    }
    if (mismatches.length > 0) {
        throw new RealtimeAuthError(`Token claim mismatch: ${mismatches.join(", ")}`, "AUTH_CLAIM_MISMATCH");
    }
    return tokenClaims;
}

/** Pull a realtime session token from `Authorization: Bearer <jwt>`. */
export function extractBearerToken(headers: Headers): string | null {
    const auth = headers.get("authorization");
    if (!auth) return null;
    const match = /^Bearer\s+(.+)$/i.exec(auth);
    return match ? match[1].trim() : null;
}
