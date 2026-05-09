import { describe, expect, test } from "vitest";

import { createProgram } from "../src/cli.js";

describe("contextual help", () => {
    test("shows auth subcommand help for incomplete auth command", async () => {
        const output: string[] = [];
        const program = createProgram({
            stdout: message => output.push(message),
            stderr: message => output.push(message)
        });
        program.exitOverride();

        await program.parseAsync(["node", "youvico", "auth"]);

        expect(output.join("\n")).toContain("Usage: youvico auth");
        expect(output.join("\n")).toContain("api");
        expect(output.join("\n")).toContain("status");
    });

    test("shows file subcommand help for incomplete file command", async () => {
        const output: string[] = [];
        const program = createProgram({
            stdout: message => output.push(message),
            stderr: message => output.push(message)
        });
        program.exitOverride();

        await program.parseAsync(["node", "youvico", "file"]);

        expect(output.join("\n")).toContain("Usage: youvico file");
        expect(output.join("\n")).toContain("upload.file");
        expect(output.join("\n")).toContain("upload.youtube");
        expect(output.join("\n")).toContain("update.tag");
        expect(output.join("\n")).toContain("delete");
        expect(output.join("\n")).toContain("list");
    });

    test("shows config subcommand help", async () => {
        const output: string[] = [];
        const program = createProgram({
            stdout: message => output.push(message),
            stderr: message => output.push(message)
        });
        program.exitOverride();

        await program.parseAsync(["node", "youvico", "config"]);

        const help = output.join("\n");
        expect(help).toContain("get");
        expect(help).toContain("set");
        expect(help).toContain("clear");
    });

    test("shows folder subcommand help", async () => {
        const output: string[] = [];
        const program = createProgram({
            stdout: message => output.push(message),
            stderr: message => output.push(message)
        });
        program.exitOverride();

        await program.parseAsync(["node", "youvico", "folder"]);

        const help = output.join("\n");
        expect(help).toContain("list");
        expect(help).toContain("create");
        expect(help).toContain("update");
        expect(help).toContain("delete");
    });

    test("shows comment help without duplicate reply command", async () => {
        const output: string[] = [];
        const program = createProgram({
            stdout: message => output.push(message),
            stderr: message => output.push(message)
        });
        program.exitOverride();

        await program.parseAsync(["node", "youvico", "comment"]);

        const help = output.join("\n");
        expect(help).toContain("create");
        expect(help).toContain("replies");
        expect(help).not.toContain("reply [options]");
    });

    test("shows reaction subcommand help", async () => {
        const output: string[] = [];
        const program = createProgram({
            stdout: message => output.push(message),
            stderr: message => output.push(message)
        });
        program.exitOverride();

        await program.parseAsync(["node", "youvico", "reaction"]);

        const help = output.join("\n");
        expect(help).toContain("list");
        expect(help).toContain("create");
        expect(help).toContain("delete");
    });
});
