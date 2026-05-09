import { Client } from "@youvico/api";

import { getClientConfig, readApiKey } from "./config.js";

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

export async function validateApiKey(apiKey: string) {
    const client = new Client(await clientOptions(apiKey));
    await client.projects.search({ query: "test" });
}
