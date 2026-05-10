import { readFileSync } from "node:fs";

import { describe, expect, test } from "vitest";

import packageJson from "../package.json" with { type: "json" };
import { CLI_VERSION } from "../src/version.js";

describe("CLI version", () => {
    test("embeds the package version without reading package.json at runtime", () => {
        const cliSource = readFileSync(new URL("../src/cli.ts", import.meta.url), "utf8");

        expect(CLI_VERSION).toBe(packageJson.version);
        expect(cliSource).not.toContain("package.json");
    });
});
