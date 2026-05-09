import { chmod, mkdtemp, readFile, stat } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { describe, expect, test } from "vitest";

import {
    clearApiKey,
    getClientConfig,
    getAuthStatus,
    readApiKey,
    setClientConfig,
    writeApiKey
} from "../src/lib/config.js";

async function tempConfigDir() {
    return mkdtemp(path.join(tmpdir(), "youvico-config-"));
}

describe("config storage", () => {
    test("reads YOUVICO_API_KEY before saved config", async () => {
        const configDir = await tempConfigDir();
        await writeApiKey("saved-key", { configDir });

        await expect(
            readApiKey({ configDir, env: { YOUVICO_API_KEY: "env-key" } })
        ).resolves.toEqual({ apiKey: "env-key", source: "env" });
    });

    test("writes api key to a 0600 config file", async () => {
        const configDir = await tempConfigDir();
        await writeApiKey("saved-key", { configDir });

        const configPath = path.join(configDir, "config.json");
        await expect(readFile(configPath, "utf8")).resolves.toContain("saved-key");
        const mode = (await stat(configPath)).mode & 0o777;
        expect(mode).toBe(0o600);
    });

    test("resets config file permissions to 0600 when updating", async () => {
        const configDir = await tempConfigDir();
        await writeApiKey("saved-key", { configDir });

        const configPath = path.join(configDir, "config.json");
        await chmod(configPath, 0o644);
        await setClientConfig({ timeoutMs: 10_000 }, { configDir });

        const mode = (await stat(configPath)).mode & 0o777;
        expect(mode).toBe(0o600);
    });

    test("clears saved api key and reports missing status", async () => {
        const configDir = await tempConfigDir();
        await writeApiKey("saved-key", { configDir });
        await clearApiKey({ configDir });

        await expect(readApiKey({ configDir, env: {} })).resolves.toBeNull();
        await expect(getAuthStatus({ configDir, env: {} })).resolves.toEqual({
            configured: false
        });
    });

    test("clears saved api key without removing client config", async () => {
        const configDir = await tempConfigDir();
        await setClientConfig({ baseUrl: "https://api.example.com", timeoutMs: 10_000 }, { configDir });
        await writeApiKey("saved-key", { configDir });
        await clearApiKey({ configDir });

        await expect(readApiKey({ configDir, env: {} })).resolves.toBeNull();
        await expect(getClientConfig({ configDir, env: {} })).resolves.toEqual({
            baseUrl: "https://api.example.com",
            timeoutMs: 10_000
        });
        await expect(readFile(path.join(configDir, "config.json"), "utf8")).resolves.not.toContain("saved-key");
    });

    test("stores client config next to auth config", async () => {
        const configDir = await tempConfigDir();
        await writeApiKey("saved-key", { configDir });
        await setClientConfig({ baseUrl: "https://api.example.com", timeoutMs: 10_000 }, { configDir });

        await expect(getClientConfig({ configDir, env: {} })).resolves.toEqual({
            baseUrl: "https://api.example.com",
            timeoutMs: 10_000
        });
        await expect(readFile(path.join(configDir, "config.json"), "utf8")).resolves.toContain("saved-key");
    });

    test("updates one client config value without clearing the other", async () => {
        const configDir = await tempConfigDir();
        await setClientConfig({ baseUrl: "https://api.example.com", timeoutMs: 10_000 }, { configDir });
        await setClientConfig({ timeoutMs: 20_000 }, { configDir });

        await expect(getClientConfig({ configDir, env: {} })).resolves.toEqual({
            baseUrl: "https://api.example.com",
            timeoutMs: 20_000
        });

        await setClientConfig({ baseUrl: "https://api2.example.com" }, { configDir });

        await expect(getClientConfig({ configDir, env: {} })).resolves.toEqual({
            baseUrl: "https://api2.example.com",
            timeoutMs: 20_000
        });
    });

    test("reads saved client config without environment overrides", async () => {
        const configDir = await tempConfigDir();
        await setClientConfig({ baseUrl: "https://saved.example.com", timeoutMs: 10_000 }, { configDir });

        await expect(getClientConfig({
            configDir,
            env: {
                YOUVICO_BASE_URL: "https://env.example.com",
                YOUVICO_TIMEOUT_MS: "20000"
            }
        })).resolves.toEqual({
            baseUrl: "https://saved.example.com",
            timeoutMs: 10_000
        });
    });
});
