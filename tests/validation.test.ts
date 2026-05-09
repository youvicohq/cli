import { afterEach, describe, expect, test } from "vitest";

import { createProgram } from "../src/cli.js";

afterEach(() => {
    process.exitCode = undefined;
});

describe("command validation", () => {
    test("rejects invalid config timeout", async () => {
        const output: string[] = [];
        const program = createProgram({
            stdout: message => output.push(message),
            stderr: message => output.push(message)
        });
        program.exitOverride();

        await expect(
            program.parseAsync(["node", "youvico", "config", "set", "--timeout-ms", "abc"])
        ).rejects.toThrow("process.exit unexpectedly called");
        expect(output.join("\n")).toContain("must be a positive integer");
    });

    test("rejects invalid project page", async () => {
        const output: string[] = [];
        const program = createProgram({
            stdout: message => output.push(message),
            stderr: message => output.push(message)
        });
        program.exitOverride();

        await expect(
            program.parseAsync(["node", "youvico", "project", "search", "--query", "launch", "--page", "abc"])
        ).rejects.toThrow("process.exit unexpectedly called");
        expect(output.join("\n")).toContain("must be a positive integer");
    });

    test("rejects file update without update fields", async () => {
        const output: string[] = [];
        const program = createProgram({
            stdout: message => output.push(message),
            stderr: message => output.push(message)
        });

        await program.parseAsync(["node", "youvico", "file", "update", "--id", "file-id"]);

        expect(output.join("\n")).toContain("Provide at least one update option");
        expect(process.exitCode).toBe(1);
    });

    test("rejects conflicting file description options", async () => {
        const output: string[] = [];
        const program = createProgram({
            stdout: message => output.push(message),
            stderr: message => output.push(message)
        });

        await program.parseAsync([
            "node",
            "youvico",
            "file",
            "update",
            "--id",
            "file-id",
            "--description",
            "hello",
            "--clear-description"
        ]);

        expect(output.join("\n")).toContain("Use either --description or --clear-description");
        expect(process.exitCode).toBe(1);
    });
});
