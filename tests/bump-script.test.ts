import { execFile, spawnSync } from "node:child_process";
import { chmodSync, cpSync, mkdirSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { promisify } from "node:util";
import { describe, expect, test } from "vitest";

import packageJson from "../package.json" with { type: "json" };

const execFileAsync = promisify(execFile);

describe("bump release script", () => {
    test("exposes pnpm bump as the release entrypoint", () => {
        expect(packageJson.scripts.bump).toBe("node scripts/bump.mjs");
    });

    test("plans version bump, commit, tag, and push for a valid bump type", async () => {
        const { stdout } = await execFileAsync(
            process.execPath,
            ["scripts/bump.mjs", "--dry-run", "minor"],
            { cwd: process.cwd() }
        );

        const plan = JSON.parse(stdout) as {
            bump: string;
            commands: Array<{ command: string; args: string[] }>;
        };

        expect(plan.bump).toBe("minor");
        expect(plan.commands).toEqual([
            { command: "git", args: ["status", "--porcelain"] },
            { command: "pnpm", args: ["version", "<version>", "--no-git-tag-version"] },
            { command: "pnpm", args: ["install", "--frozen-lockfile"] },
            { command: "node", args: ["scripts/sync-version.mjs"] },
            { command: "pnpm", args: ["run", "typecheck"] },
            { command: "pnpm", args: ["run", "lint"] },
            { command: "pnpm", args: ["test"] },
            { command: "pnpm", args: ["run", "build"] },
            { command: "pnpm", args: ["run", "pack:dry-run"] },
            { command: "git", args: ["add", "package.json", "pnpm-lock.yaml", "src/version.ts"] },
            { command: "git", args: ["commit", "-m", "chore(release): v<version>"] },
            { command: "git", args: ["tag", "-a", "v<version>", "-m", "v<version>"] },
            { command: "git", args: ["push", "origin", "HEAD", "--follow-tags"] },
            {
                command: "gh",
                args: ["run", "list", "--workflow", "Publish", "--json", "databaseId,headSha,status", "--limit", "20"]
            },
            { command: "gh", args: ["run", "watch", "<run-id>", "--exit-status"] }
        ]);
    });

    test("rejects unsupported bump types", async () => {
        await expect(execFileAsync(
            process.execPath,
            ["scripts/bump.mjs", "--dry-run", "premajor"],
            { cwd: process.cwd() }
        )).rejects.toMatchObject({
            stderr: expect.stringContaining("Usage: pnpm bump <patch|minor|major>")
        });
    });

    test("cancels before changing package version when release is not confirmed", () => {
        const workspace = createBumpWorkspace();

        const result = spawnSync(process.execPath, ["scripts/bump.mjs", "patch"], {
            cwd: workspace,
            encoding: "utf8",
            env: fakeEnv(workspace),
            input: "no\n"
        });

        expect(result.status).toBe(1);
        expect(result.stderr).toContain("Release cancelled.");
        expect(JSON.parse(readFileSync(join(workspace, "package.json"), "utf8")).version).toBe("1.4.0");
    });
});

function createBumpWorkspace() {
    const workspace = mkdtempSync(join(tmpdir(), "youvico-cli-bump-"));
    mkdirSync(join(workspace, "fakebin"), { recursive: true });
    mkdirSync(join(workspace, "scripts"), { recursive: true });
    mkdirSync(join(workspace, "src"), { recursive: true });

    cpSync(join(process.cwd(), "scripts/bump.mjs"), join(workspace, "scripts/bump.mjs"));
    cpSync(join(process.cwd(), "scripts/sync-version.mjs"), join(workspace, "scripts/sync-version.mjs"));
    writeFileSync(join(workspace, "package.json"), `${JSON.stringify({
        name: "@youvico/cli",
        version: "1.4.0"
    }, null, 2)}\n`);
    writeFileSync(join(workspace, "pnpm-lock.yaml"), "lockfileVersion: '9.0'\n");
    writeFileSync(join(workspace, "src/version.ts"), "export const CLI_VERSION = \"1.4.0\";\n");

    writeFakeCommand(workspace, "git", `
if (args.join(" ") === "status --porcelain") process.exit(0);
if (args.join(" ") === "rev-parse HEAD") {
    process.stdout.write("abc123\\n");
    process.exit(0);
}
process.exit(0);
`);
    writeFakeCommand(workspace, "pnpm", `
if (args[0] === "version") {
    const fs = await import("node:fs");
    const packageJson = JSON.parse(fs.readFileSync("package.json", "utf8"));
    packageJson.version = "1.4.1";
    fs.writeFileSync("package.json", JSON.stringify(packageJson, null, 2) + "\\n");
}
process.exit(0);
`);
    writeFakeCommand(workspace, "gh", `
if (args.join(" ").startsWith("run list ")) {
    process.stdout.write(JSON.stringify([{ headSha: "abc123", databaseId: 123 }]));
}
process.exit(0);
`);

    return workspace;
}

function writeFakeCommand(workspace: string, command: string, body: string) {
    const commandPath = join(workspace, "fakebin", command);
    writeFileSync(commandPath, `#!/usr/bin/env node
const args = process.argv.slice(2);
${body}
`);
    chmodSync(commandPath, 0o755);
}

function fakeEnv(workspace: string) {
    return {
        ...process.env,
        PATH: `${join(workspace, "fakebin")}:${process.env.PATH}`
    };
}
