// agora-token is CommonJS; default-import + destructure works across the
// ESM (Node/tsx) and Vite bundler interop boundaries.
import agoraToken from "agora-token";
const { RtcTokenBuilder, RtcRole } = agoraToken;

/**
 * Server-side Agora helpers — the secret-holding half of the NPC voice stack.
 *
 * Everything here used to live in the Unity client (App Certificate, Customer
 * ID/Secret, the custom-LLM Agent API key), which meant every game build shipped
 * those secrets. For multiplayer that's untenable: anyone could extract them and
 * drain the account. Phase 1 moves them here so the client only ever receives a
 * short-lived RTC token + session JWT.
 *
 * - `buildRtcToken` mints an Agora RTC token from the App Certificate.
 * - `startConversationalAgent` / `stopConversationalAgent` call Agora's
 *   Conversational AI Engine using the Customer ID/Secret (HTTP Basic).
 *
 * The join payload mirrors the Unity client's previous `BuildJoinRequestJson`.
 */

/** Normalize a BCP-47 tag to `xx-YY` (what Agora/Deepgram expect). */
export function normalizeLocaleTag(locale: string | null | undefined): string {
    const raw = String(locale ?? "").trim().replace("_", "-");
    if (!raw) return "";
    const [lang, region] = raw.split("-");
    if (!lang) return "";
    if (region) return `${lang.toLowerCase()}-${region.toUpperCase()}`;
    // Language-only input: expand to the common region so ASR gets a full tag.
    const defaults: Record<string, string> = {
        tr: "tr-TR", en: "en-US", ru: "ru-RU", de: "de-DE", fr: "fr-FR",
        es: "es-ES", it: "it-IT", ar: "ar-SA", az: "az-AZ", nl: "nl-NL",
        pt: "pt-PT", ja: "ja-JP", ko: "ko-KR", zh: "zh-CN", hi: "hi-IN",
    };
    return defaults[lang.toLowerCase()] || lang.toLowerCase();
}

/** Human-readable language name for prompting the LLM. */
export function languageNameFor(locale: string): string {
    const lang = String(locale || "").split("-")[0].toLowerCase();
    const names: Record<string, string> = {
        tr: "Turkish", en: "English", ru: "Russian", de: "German", fr: "French",
        es: "Spanish", it: "Italian", ar: "Arabic", az: "Azerbaijani", nl: "Dutch",
        pt: "Portuguese", ja: "Japanese", ko: "Korean", zh: "Chinese", hi: "Hindi",
    };
    return names[lang] || locale || "the user's language";
}

function requireEnv(name: string): string {
    const value = process.env[name];
    if (!value || !value.trim()) {
        throw new Error(`Missing required env var: ${name}`);
    }
    return value.trim();
}

export function getAgoraAppId(): string {
    return requireEnv("AGORA_APP_ID");
}

/**
 * Build an Agora RTC token for a channel + uid. `role` defaults to publisher so
 * the player can speak. Uses the official agora-token AccessToken2 builder.
 */
export function buildRtcToken(params: {
    channel: string;
    uid: number;
    role?: "publisher" | "subscriber";
    expireSeconds?: number;
}): string {
    const appId = getAgoraAppId();
    const appCertificate = requireEnv("AGORA_APP_CERTIFICATE");
    const expire = Math.max(60, Math.min(86400, params.expireSeconds ?? 3600));
    const role = params.role === "subscriber" ? RtcRole.SUBSCRIBER : RtcRole.PUBLISHER;

    return RtcTokenBuilder.buildTokenWithUid(
        appId,
        appCertificate,
        params.channel,
        params.uid,
        role,
        expire,
        expire,
    );
}

function agoraBasicAuthHeader(): string {
    const customerId = requireEnv("AGORA_CUSTOMER_ID");
    const customerSecret = requireEnv("AGORA_CUSTOMER_SECRET");
    const raw = `${customerId}:${customerSecret}`;
    return "Basic " + Buffer.from(raw, "utf8").toString("base64");
}

export type StartAgentOptions = {
    channel: string;
    agentRtcUid: string;
    agentRtcToken: string;
    remoteRtcUid: string;
    /** Assistant id/slug for the custom LLM (Agora's `llm.params.model`). */
    model?: string;
    /** Player's language (BCP-47). Drives ASR and the reply language. */
    locale?: string;
    namePrefix?: string;
    preset?: string;
    asrLanguage?: string;
    idleTimeoutSeconds?: number;
    maxHistory?: number;
    ttsVoice?: string;
    ttsSpeed?: number;
    /** Agora Interruption. Kept OFF by default (choppy-audio lesson). */
    enableInterruption?: boolean;
};

/**
 * Start an Agora Conversational AI agent. Secrets (Customer ID/Secret, the
 * custom-LLM Agent API key, the LLM URL) are injected here from env — the caller
 * only provides non-secret routing (channel, uids, which assistant model).
 */
export async function startConversationalAgent(opts: StartAgentOptions): Promise<{ agentId: string }> {
    const appId = getAgoraAppId();
    const llmUrl = requireEnv("AGENT_LLM_URL");
    const llmApiKey = requireEnv("AGENT_LLM_API_KEY");

    // Agora's cloud calls this URL, so it must be publicly reachable. A
    // placeholder or localhost URL starts an agent that can never answer — and
    // the failure is silent (the NPC just never speaks), so catch it here.
    // NOTE: this reads the value the server loaded at STARTUP; if you edit .env
    // you must restart the server for the change to take effect.
    if (/your-backend|localhost|127\.0\.0\.1|0\.0\.0\.0/i.test(llmUrl)) {
        throw new Error(
            `AGENT_LLM_URL is not publicly reachable ("${llmUrl}"). ` +
            `Agora's cloud must be able to call it — use your public/ngrok URL, ` +
            `then RESTART the backend so the new .env value is loaded.`,
        );
    }
    const llmModel = (opts.model || process.env.AGENT_LLM_MODEL || "").trim();
    if (!llmModel) {
        throw new Error("No LLM model resolved (pass model or set AGENT_LLM_MODEL)");
    }

    const preset = opts.preset || process.env.AGORA_AGENT_PRESET || "deepgram_nova_3,openai_tts_1";
    const playerLocale = normalizeLocaleTag(opts.locale) || process.env.REALTIME_ASR_LANGUAGE || "tr-TR";
    // Explicit override wins; otherwise follow the player's own locale.
    const asrLanguage = opts.asrLanguage || playerLocale;
    const body = {
        name: `${opts.namePrefix || "npc"}-${Date.now()}`,
        preset,
        properties: {
            channel: opts.channel,
            token: opts.agentRtcToken,
            agent_rtc_uid: opts.agentRtcUid,
            remote_rtc_uids: [opts.remoteRtcUid],
            idle_timeout: opts.idleTimeoutSeconds ?? 120,
            // ASR language, per player. "multi" (code-switching) only covers ~10
            // languages and Turkish is NOT one of them — Turkish speech came back
            // as Hindi/Korean gibberish. Naming the language explicitly fixes it,
            // and using THIS player's locale is what makes a mixed-language room
            // work (one player tr-TR, another en-US).
            asr: { language: asrLanguage, params: {} },
            llm: {
                vendor: "custom",
                url: llmUrl,
                api_key: llmApiKey,
                model: llmModel,
                // Agora forwards `llm.params` into the JSON body it POSTs to the
                // custom LLM. Without params.model the request arrives WITHOUT a
                // `model` field and the backend has to guess which assistant to
                // use — which silently picked the wrong (non-RAG) one.
                // `locale` rides along so the LLM answers in THIS player's
                // language — each player has their own agent, so in multiplayer
                // a Turkish and an English speaker each get their own language.
                params: { model: llmModel, locale: playerLocale },
                max_history: opts.maxHistory ?? 10,
            },
            tts: {
                params: {
                    voice: opts.ttsVoice || "coral",
                    speed: opts.ttsSpeed ?? 1,
                },
            },
            // Keep Agora's own interruption OFF (barge-in handled client-side).
            interruption: { enable: opts.enableInterruption === true, mode: "start_of_speech" },
        },
    };

    console.log(
        `AGORA agent start: channel=${opts.channel} model=${llmModel} llm.url=${llmUrl}`,
    );

    const url = `https://api.agora.io/api/conversational-ai-agent/v2/projects/${appId}/join`;
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: agoraBasicAuthHeader(),
        },
        body: JSON.stringify(body),
    });

    const text = await response.text();
    if (!response.ok) {
        throw new Error(`Agora agent join failed: ${response.status} ${text.slice(0, 300)}`);
    }

    let parsed: { agent_id?: string };
    try {
        parsed = JSON.parse(text);
    } catch {
        throw new Error(`Agora agent join returned non-JSON: ${text.slice(0, 200)}`);
    }

    if (!parsed.agent_id) {
        throw new Error(`Agora agent join response missing agent_id: ${text.slice(0, 200)}`);
    }
    return { agentId: parsed.agent_id };
}

/**
 * Fetch an agent's conversation history from Agora. Kept server-side because it
 * needs the Customer ID/Secret (HTTP Basic) — the Unity client used to hold
 * these. Returns the raw JSON text for the client to parse.
 */
export async function getAgentHistory(agentId: string): Promise<string> {
    const appId = getAgoraAppId();
    const url = `https://api.agora.io/api/conversational-ai-agent/v2/projects/${appId}/agents/${agentId}/history`;
    const response = await fetch(url, {
        method: "GET",
        headers: { Authorization: agoraBasicAuthHeader() },
    });
    const text = await response.text();
    if (!response.ok) {
        throw new Error(`Agora agent history failed: ${response.status} ${text.slice(0, 200)}`);
    }
    return text;
}

/** Stop a running Conversational AI agent. */
export async function stopConversationalAgent(agentId: string): Promise<void> {
    const appId = getAgoraAppId();
    const url = `https://api.agora.io/api/conversational-ai-agent/v2/projects/${appId}/agents/${agentId}/leave`;
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: agoraBasicAuthHeader(),
        },
        body: "{}",
    });
    if (!response.ok) {
        const text = await response.text();
        throw new Error(`Agora agent leave failed: ${response.status} ${text.slice(0, 200)}`);
    }
}
