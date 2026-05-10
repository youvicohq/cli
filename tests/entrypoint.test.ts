import { mkdtempSync, symlinkSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

import { describe, expect, test } from "vitest";

import { isEntrypoint } from "../src/cli.js";

describe("CLI entrypoint detection", () => {
    test("recognizes npm bin symlinks as the CLI entrypoint", () => {
        const modulePath = fileURLToPath(new URL("../src/cli.ts", import.meta.url));
        const tempDir = mkdtempSync(path.join(tmpdir(), "youvico-entrypoint-"));
        const binPath = path.join(tempDir, "youvico");

        symlinkSync(modulePath, binPath);

        expect(isEntrypoint(binPath, pathToFileURL(modulePath).href)).toBe(true);
    });
});
