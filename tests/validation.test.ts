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

    test("rejects invalid project member", async () => {
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
                "project",
                "create",
                "--name",
                "Launch",
                "--access-range",
                "ONLY_PROJECT_MEMBER",
                "--member",
                "user-id:OWNER"
            ])
        ).rejects.toThrow("process.exit unexpectedly called");
        expect(output.join("\n")).toContain("must be userId:PROJECT_MANAGER");
    });

    test("rejects project update without update fields", async () => {
        const output: string[] = [];
        const program = createProgram({
            stdout: message => output.push(message),
            stderr: message => output.push(message)
        });

        await program.parseAsync(["node", "youvico", "project", "update", "--id", "project-id"]);

        expect(output.join("\n")).toContain("Provide at least one update option");
        expect(output.join("\n")).toContain("--access-range");
        expect(process.exitCode).toBe(1);
    });

    test("rejects conflicting project description options", async () => {
        const output: string[] = [];
        const program = createProgram({
            stdout: message => output.push(message),
            stderr: message => output.push(message)
        });

        await program.parseAsync([
            "node",
            "youvico",
            "project",
            "update",
            "--id",
            "project-id",
            "--description",
            "hello",
            "--clear-description"
        ]);

        expect(output.join("\n")).toContain("Use either --description or --clear-description");
        expect(process.exitCode).toBe(1);
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

    test("rejects comment duration without an anchor", async () => {
        const output: string[] = [];
        const program = createProgram({
            stdout: message => output.push(message),
            stderr: message => output.push(message)
        });

        await program.parseAsync([
            "node",
            "youvico",
            "comment",
            "create",
            "--file",
            "file-id",
            "--duration",
            "1"
        ]);

        expect(output.join("\n")).toContain("Use --duration only with --anchor");
        expect(process.exitCode).toBe(1);
    });

    test("rejects comment create without file or project target", async () => {
        const output: string[] = [];
        const program = createProgram({
            stdout: message => output.push(message),
            stderr: message => output.push(message)
        });

        await program.parseAsync([
            "node",
            "youvico",
            "comment",
            "create",
            "--content",
            "hello"
        ]);

        expect(output.join("\n")).toContain("Provide either --file or --project");
        expect(process.exitCode).toBe(1);
    });

    test("rejects an empty comment", async () => {
        const output: string[] = [];
        const program = createProgram({
            stdout: message => output.push(message),
            stderr: message => output.push(message)
        });

        await program.parseAsync([
            "node",
            "youvico",
            "comment",
            "create",
            "--file",
            "file-id"
        ]);

        expect(output.join("\n")).toContain("Provide --content, timeline options, or at least one --attachment");
        expect(process.exitCode).toBe(1);
    });

    test("rejects comment attachment upload without a target", async () => {
        const output: string[] = [];
        const program = createProgram({
            stdout: message => output.push(message),
            stderr: message => output.push(message)
        });

        await program.parseAsync([
            "node",
            "youvico",
            "comment-attachment",
            "upload",
            "--path",
            "/tmp/review.pdf"
        ]);

        expect(output.join("\n")).toContain("Provide either --file or --project");
        expect(process.exitCode).toBe(1);
    });

    test("rejects conflicting comment attachment upload targets", async () => {
        const output: string[] = [];
        const program = createProgram({
            stdout: message => output.push(message),
            stderr: message => output.push(message)
        });

        await program.parseAsync([
            "node",
            "youvico",
            "comment-attachment",
            "upload",
            "--file",
            "file-id",
            "--project",
            "project-id",
            "--path",
            "/tmp/review.pdf"
        ]);

        expect(output.join("\n")).toContain("Use either --file or --project, not both");
        expect(process.exitCode).toBe(1);
    });

    test("rejects comment list without file or project target", async () => {
        const output: string[] = [];
        const program = createProgram({
            stdout: message => output.push(message),
            stderr: message => output.push(message)
        });

        await program.parseAsync([
            "node",
            "youvico",
            "comment",
            "list"
        ]);

        expect(output.join("\n")).toContain("Provide either --file or --project");
        expect(process.exitCode).toBe(1);
    });

    test("rejects conflicting comment list targets", async () => {
        const output: string[] = [];
        const program = createProgram({
            stdout: message => output.push(message),
            stderr: message => output.push(message)
        });

        await program.parseAsync([
            "node",
            "youvico",
            "comment",
            "list",
            "--file",
            "file-id",
            "--project",
            "project-id"
        ]);

        expect(output.join("\n")).toContain("Use either --file or --project");
        expect(process.exitCode).toBe(1);
    });

    test("rejects conflicting comment create targets", async () => {
        const output: string[] = [];
        const program = createProgram({
            stdout: message => output.push(message),
            stderr: message => output.push(message)
        });

        await program.parseAsync([
            "node",
            "youvico",
            "comment",
            "create",
            "--file",
            "file-id",
            "--project",
            "project-id",
            "--content",
            "hello"
        ]);

        expect(output.join("\n")).toContain("Use either --file or --project");
        expect(process.exitCode).toBe(1);
    });

    test("rejects timeline options for project comments", async () => {
        const output: string[] = [];
        const program = createProgram({
            stdout: message => output.push(message),
            stderr: message => output.push(message)
        });

        await program.parseAsync([
            "node",
            "youvico",
            "comment",
            "create",
            "--project",
            "project-id",
            "--content",
            "hello",
            "--anchor",
            "1"
        ]);

        expect(output.join("\n")).toContain("Use --anchor and --duration only with --file");
        expect(process.exitCode).toBe(1);
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
