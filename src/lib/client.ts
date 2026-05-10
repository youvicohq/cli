import { Client, type PingResult } from "@youvico/api";

import { getClientConfig, maskApiKey, readApiKey, type ApiKeySource } from "./config.js";

const DEFAULT_TIMEOUT_MS = 30_000;

export type YouvicoClient = Client;

async function clientOptions(apiKey: string) {
    const config = await getClientConfig();

    return {
        apiKey,
        baseUrl: config.baseUrl,
        timeoutMs: config.timeoutMs ?? DEFAULT_TIMEOUT_MS
    };
}

export async function createClient() {
    const auth = await readApiKey();
    if (!auth) {
        throw new Error("No API key configured. Run `youvico auth api` or set YOUVICO_API_KEY.");
    }

    return new Client(await clientOptions(auth.apiKey));
}

export type AuthPingResult = PingResult & {
    source: ApiKeySource;
    apiKeyPreview: string;
};

export async function pingApiKey(apiKey: string) {
    const client = new Client(await clientOptions(apiKey));
    const response = await client.ping();
    return response.data;
}

export async function pingConfiguredApiKey(): Promise<AuthPingResult> {
    const auth = await readApiKey();
    if (!auth) {
        throw new Error("No API key configured. Run `youvico auth api` or set YOUVICO_API_KEY.");
    }

    return {
        ...await pingApiKey(auth.apiKey),
        source: auth.source,
        apiKeyPreview: maskApiKey(auth.apiKey)
    };
}

export const validateApiKey = pingApiKey;
