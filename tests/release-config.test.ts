import { readFileSync } from "node:fs";

import { describe, expect, test } from "vitest";

import packageJson from "../package.json" with { type: "json" };

describe("release configuration", () => {
    test("uses GitHub Actions as the release entrypoint", () => {
        expect(packageJson.scripts).not.toHaveProperty("bump");
        expect(packageJson.scripts).not.toHaveProperty("version");
    });

    test("configures Lerna like sdk-js for a single CLI package", () => {
        const lernaJson = JSON.parse(readFileSync("lerna.json", "utf8"));

        expect(lernaJson).toMatchObject({
            version: packageJson.version,
            packages: ["."],
            npmClient: "pnpm",
            command: {
                version: {
                    allowBranch: "main",
                    forcePublish: true,
                    message: "chore(release): v%s",
                    noPrivate: true,
                    push: false,
                    yes: true
                },
                publish: {
                    noPrivate: true,
                    yes: true
                }
            }
        });
    });

    test("manually bumps and publishes through Lerna in GitHub Actions", () => {
        const workflow = readFileSync(".github/workflows/publish.yml", "utf8");

        expect(workflow).toContain("workflow_dispatch:");
        expect(workflow).toContain("inputs:");
        expect(workflow).toContain("bump:");
        expect(workflow).toContain("options:");
        expect(workflow).toContain("- patch");
        expect(workflow).toContain("- minor");
        expect(workflow).toContain("- major");
        expect(workflow).toContain("pnpm exec lerna version \"${{ inputs.bump }}\"");
        expect(workflow).toContain("pnpm exec lerna publish from-git");
        expect(workflow).toContain("git push --follow-tags origin \"HEAD:${GITHUB_REF_NAME}\"");
        expect(workflow).not.toContain("npm publish");
        expect(workflow).not.toContain("Update CLI version constant");
        expect(workflow).not.toContain("git commit --amend --no-edit");
    });
});
