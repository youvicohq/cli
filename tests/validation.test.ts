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
        expect(output.join("\n")).toContain("--folder");
        expect(output.join("\n")).toContain("--clear-folder");
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

    test("rejects conflicting file folder options", async () => {
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
            "--folder",
            "folder-id",
            "--clear-folder"
        ]);

        expect(output.join("\n")).toContain("Use either --folder or --clear-folder");
        expect(process.exitCode).toBe(1);
    });

    test("rejects invalid comment anchor", async () => {
        const output: string[] = [];
        const program = createProgram({
            stdout: message => output.push(message),
            stderr: message => output.push(message)
        });
        program.exitOverride();

        await expect(
            program.parseAsync([
                "node",
                "youvico",
                "comment",
                "create",
                "--file",
                "file-id",
                "--content",
                "hello",
                "--anchor",
                "abc"
            ])
        ).rejects.toThrow("process.exit unexpectedly called");
        expect(output.join("\n")).toContain("must be a non-negative integer");
    });

    test("rejects invalid comment duration", async () => {
        const output: string[] = [];
        const program = createProgram({
            stdout: message => output.push(message),
            stderr: message => output.push(message)
        });
        program.exitOverride();

        await expect(
            program.parseAsync([
                "node",
                "youvico",
                "comment",
                "create",
                "--file",
                "file-id",
                "--content",
                "hello",
                "--duration",
                "0"
            ])
        ).rejects.toThrow("process.exit unexpectedly called");
        expect(output.join("\n")).toContain("must be a positive integer");
    });

    test("rejects fractional comment duration", async () => {
        const output: string[] = [];
        const program = createProgram({
            stdout: message => output.push(message),
            stderr: message => output.push(message)
        });
        program.exitOverride();

        await expect(
            program.parseAsync([
                "node",
                "youvico",
                "comment",
                "create",
                "--file",
                "file-id",
                "--content",
                "hello",
                "--duration",
                "0.5"
            ])
        ).rejects.toThrow("process.exit unexpectedly called");
        expect(output.join("\n")).toContain("must be a positive integer");
    });

    test("rejects skill update without update fields", async () => {
        const output: string[] = [];
        const program = createProgram({
            stdout: message => output.push(message),
            stderr: message => output.push(message)
        });

        await program.parseAsync(["node", "youvico", "skill", "update", "--id", "skill-id"]);

        expect(output.join("\n")).toContain("Provide at least one update option");
        expect(output.join("\n")).toContain("--default-version");
        expect(process.exitCode).toBe(1);
    });

    test("rejects conflicting skill optional field update options", async () => {
        const output: string[] = [];
        const program = createProgram({
            stdout: message => output.push(message),
            stderr: message => output.push(message)
        });

        await program.parseAsync([
            "node",
            "youvico",
            "skill",
            "update",
            "--id",
            "skill-id",
            "--metadata",
            "{\"tier\":\"internal\"}",
            "--clear-metadata",
            "--allowed-tool",
            "slack",
            "--clear-allowed-tools",
            "--license",
            "MIT",
            "--clear-license"
        ]);

        expect(output.join("\n")).toContain("Use either --metadata or --clear-metadata");
        expect(process.exitCode).toBe(1);
    });

    test("rejects skill-version content-file option", async () => {
        const output: string[] = [];
        const program = createProgram({
            stdout: message => output.push(message),
            stderr: message => output.push(message)
        });
        program.exitOverride();

        await expect(
            program.parseAsync([
                "node",
                "youvico",
                "skill-version",
                "publish",
                "--skill",
                "skill-id",
                "--content",
                "inline",
                "--content-file",
                "SKILL.md"
            ])
        ).rejects.toThrow("process.exit unexpectedly called");

        expect(output.join("\n")).toContain("unknown option '--content-file'");
    });
});
