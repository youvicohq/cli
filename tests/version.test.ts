import { describe, expect, test } from "vitest";

import packageJson from "../package.json" with { type: "json" };
import { createProgram } from "../src/cli.js";

describe("CLI version", () => {
    test("prints the package version", async () => {
        const output: string[] = [];
        const program = createProgram({
            stdout: message => output.push(message)
        });

        await program.parseAsync(["node", "youvico", "version"]);

        expect(output).toEqual([packageJson.version]);
    });
});
