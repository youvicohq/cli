import { execFile } from "node:child_process";
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
            { command: "pnpm", args: ["version", "minor", "--no-git-tag-version"] },
            { command: "pnpm", args: ["install", "--lockfile-only"] },
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
});
