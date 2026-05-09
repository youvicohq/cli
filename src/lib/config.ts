import { chmod, mkdir, readFile, writeFile } from "node:fs/promises";
import { homedir } from "node:os";
import path from "node:path";

type ConfigOptions = {
    configDir?: string;
    env?: NodeJS.ProcessEnv | Record<string, string | undefined>;
};

type AuthConfig = {
    apiKey?: string;
    baseUrl?: string;
    timeoutMs?: number;
};

export type ApiKeySource = "env" | "config";

export type ApiKeyResult = {
    apiKey: string;
    source: ApiKeySource;
};

export type ClientConfig = {
    baseUrl?: string;
    timeoutMs?: number;
};

export function resolveConfigDir(options: ConfigOptions = {}) {
    return (
        options.configDir ??
        options.env?.YOUVICO_CONFIG_DIR ??
        path.join(homedir(), ".config", "youvico")
    );
}

export function resolveConfigPath(options: ConfigOptions = {}) {
    return path.join(resolveConfigDir(options), "config.json");
}

export async function readConfig(options: ConfigOptions = {}): Promise<AuthConfig> {
    try {
        const raw = await readFile(resolveConfigPath(options), "utf8");
        const parsed = JSON.parse(raw) as AuthConfig;
        return parsed && typeof parsed === "object" ? parsed : {};
    }
    catch (error) {
        if ((error as NodeJS.ErrnoException).code === "ENOENT") {
            return {};
        }
        throw error;
    }
}

export async function readApiKey(options: ConfigOptions = {}): Promise<ApiKeyResult | null> {
    const envApiKey = options.env?.YOUVICO_API_KEY ?? process.env.YOUVICO_API_KEY;
    if (envApiKey) {
        return { apiKey: envApiKey, source: "env" };
    }

    const config = await readConfig(options);
    if (config.apiKey) {
        return { apiKey: config.apiKey, source: "config" };
    }

    return null;
}

export async function writeApiKey(apiKey: string, options: ConfigOptions = {}) {
    const config = await readConfig(options);
    await writeConfig({ ...config, apiKey }, options);
}

async function writeConfig(config: AuthConfig, options: ConfigOptions = {}) {
    const configDir = resolveConfigDir(options);
    const configPath = resolveConfigPath(options);
    await mkdir(configDir, { recursive: true, mode: 0o700 });
    await writeFile(
        configPath,
        `${JSON.stringify(config, null, 2)}\n`,
        { mode: 0o600 }
    );
    await chmod(configPath, 0o600);
}

export async function clearApiKey(options: ConfigOptions = {}) {
    const config = await readConfig(options);
    delete config.apiKey;
    await writeConfig(config, options);
}

export async function getAuthStatus(options: ConfigOptions = {}) {
    const apiKey = await readApiKey(options);
    if (!apiKey) {
        return { configured: false as const };
    }

    return { configured: true as const, source: apiKey.source };
}

export async function getClientConfig(options: ConfigOptions = {}): Promise<ClientConfig> {
    const config = await readConfig(options);

    return {
        baseUrl: config.baseUrl,
        timeoutMs: config.timeoutMs
    };
}

export async function setClientConfig(
    values: ClientConfig,
    options: ConfigOptions = {}
) {
    const config = await readConfig(options);
    if (values.baseUrl !== undefined) {
        config.baseUrl = values.baseUrl;
    }
    if (values.timeoutMs !== undefined) {
        config.timeoutMs = values.timeoutMs;
    }
    await writeConfig(config, options);
}

export async function clearClientConfig(
    keys: Array<keyof ClientConfig>,
    options: ConfigOptions = {}
) {
    const config = await readConfig(options);
    if (keys.includes("baseUrl")) {
        delete config.baseUrl;
    }
    if (keys.includes("timeoutMs")) {
        delete config.timeoutMs;
    }
    await writeConfig(config, options);
}
