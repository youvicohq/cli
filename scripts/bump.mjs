#!/usr/bin/env node
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

const VALID_BUMPS = new Set(["patch", "minor", "major"]);
const WORKFLOW_NAME = "Publish";
const USAGE = "Usage: pnpm bump <patch|minor|major>";

function parseArgs(argv) {
    const dryRun = argv.includes("--dry-run");
    const args = argv.filter(arg => arg !== "--dry-run");
    const [bump] = args;

    if (args.length !== 1 || !VALID_BUMPS.has(bump)) {
        throw new Error(USAGE);
    }

    return { bump, dryRun };
}

function releasePlan(bump, version = "<version>", runId = "<run-id>") {
    return {
        bump,
        commands: [
            { command: "git", args: ["status", "--porcelain"] },
            { command: "pnpm", args: ["version", bump, "--no-git-tag-version"] },
            { command: "pnpm", args: ["install", "--frozen-lockfile"] },
            { command: "node", args: ["scripts/sync-version.mjs"] },
            { command: "pnpm", args: ["run", "typecheck"] },
            { command: "pnpm", args: ["run", "lint"] },
            { command: "pnpm", args: ["test"] },
            { command: "pnpm", args: ["run", "build"] },
            { command: "pnpm", args: ["run", "pack:dry-run"] },
            { command: "git", args: ["add", "package.json", "pnpm-lock.yaml", "src/version.ts"] },
            { command: "git", args: ["commit", "-m", `chore(release): v${version}`] },
            { command: "git", args: ["tag", "-a", `v${version}`, "-m", `v${version}`] },
            { command: "git", args: ["push", "origin", "HEAD", "--follow-tags"] },
            {
                command: "gh",
                args: ["run", "list", "--workflow", WORKFLOW_NAME, "--json", "databaseId,headSha,status", "--limit", "20"]
            },
            { command: "gh", args: ["run", "watch", runId, "--exit-status"] }
        ]
    };
}

function run(command, args, options = {}) {
    return execFileSync(command, args, {
        encoding: options.encoding,
        stdio: options.stdio ?? "inherit"
    });
}

function readPackageVersion() {
    const packageJson = JSON.parse(readFileSync("package.json", "utf8"));
    return packageJson.version;
}

function ensureCleanWorktree() {
    const status = run("git", ["status", "--porcelain"], {
        encoding: "utf8",
        stdio: ["ignore", "pipe", "inherit"]
    });

    if (status.trim()) {
        throw new Error("Working tree must be clean before running pnpm bump.");
    }
}

function currentHeadSha() {
    return run("git", ["rev-parse", "HEAD"], {
        encoding: "utf8",
        stdio: ["ignore", "pipe", "inherit"]
    }).trim();
}

function listPublishRuns() {
    const output = run("gh", [
        "run",
        "list",
        "--workflow",
        WORKFLOW_NAME,
        "--json",
        "databaseId,headSha,status",
        "--limit",
        "20"
    ], {
        encoding: "utf8",
        stdio: ["ignore", "pipe", "inherit"]
    });

    return JSON.parse(output);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function waitForPublishRun(headSha) {
    for (let attempt = 0; attempt < 30; attempt += 1) {
        const runInfo = listPublishRuns().find(runItem => runItem.headSha === headSha);
        if (runInfo) {
            return String(runInfo.databaseId);
        }

        await sleep(2_000);
    }

    throw new Error(`Could not find a ${WORKFLOW_NAME} workflow run for ${headSha}.`);
}

async function main() {
    try {
        const { bump, dryRun } = parseArgs(process.argv.slice(2));
        if (dryRun) {
            process.stdout.write(`${JSON.stringify(releasePlan(bump), null, 2)}\n`);
            return;
        }

        ensureCleanWorktree();
        run("pnpm", ["version", bump, "--no-git-tag-version"]);
        run("pnpm", ["install", "--frozen-lockfile"]);

        const version = readPackageVersion();
        const tag = `v${version}`;

        run("node", ["scripts/sync-version.mjs"]);
        run("pnpm", ["run", "typecheck"]);
        run("pnpm", ["run", "lint"]);
        run("pnpm", ["test"]);
        run("pnpm", ["run", "build"]);
        run("pnpm", ["run", "pack:dry-run"]);

        run("git", ["add", "package.json", "pnpm-lock.yaml", "src/version.ts"]);
        run("git", ["commit", "-m", `chore(release): ${tag}`]);
        run("git", ["tag", "-a", tag, "-m", tag]);

        const headSha = currentHeadSha();
        run("git", ["push", "origin", "HEAD", "--follow-tags"]);

        const runId = await waitForPublishRun(headSha);
        run("gh", ["run", "watch", runId, "--exit-status"]);

        process.stdout.write(`${tag} published to npm and released on GitHub.\n`);
    }
    catch (error) {
        process.stderr.write(`${error.message}\n`);
        process.stderr.write(`${USAGE}\n`);
        process.exitCode = 1;
    }
}

await main();
