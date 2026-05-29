import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

const mocks = vi.hoisted(() => {
    const skillsCreate = vi.fn();
    const skillsDelete = vi.fn();
    const skillsGet = vi.fn();
    const skillsList = vi.fn();
    const skillsPublishVersion = vi.fn();
    const skillsUpdate = vi.fn();
    const skillVersionsDelete = vi.fn();
    const skillVersionsGet = vi.fn();
    const Client = vi.fn(() => ({
        skills: {
            create: skillsCreate,
            delete: skillsDelete,
            get: skillsGet,
            list: skillsList,
            publishVersion: skillsPublishVersion,
            update: skillsUpdate
        },
        skillVersions: {
            delete: skillVersionsDelete,
            get: skillVersionsGet
        }
    }));

    return {
        Client,
        skillVersionsDelete,
        skillVersionsGet,
        skillsCreate,
        skillsDelete,
        skillsGet,
        skillsList,
        skillsPublishVersion,
        skillsUpdate
    };
});

vi.mock("@youvico/api", () => ({
    Client: mocks.Client
}));

describe("SDK 1.5 skill commands", () => {
    const originalApiKey = process.env.YOUVICO_API_KEY;

    beforeEach(() => {
        process.env.YOUVICO_API_KEY = "xpi.live.djlasfnksaABCDEFG";

        mocks.Client.mockClear();
        mocks.skillVersionsDelete.mockReset();
        mocks.skillVersionsGet.mockReset();
        mocks.skillsCreate.mockReset();
        mocks.skillsDelete.mockReset();
        mocks.skillsGet.mockReset();
        mocks.skillsList.mockReset();
        mocks.skillsPublishVersion.mockReset();
        mocks.skillsUpdate.mockReset();
    });

    afterEach(async () => {
        process.exitCode = undefined;

        if (originalApiKey === undefined) {
            delete process.env.YOUVICO_API_KEY;
            return;
        }

        process.env.YOUVICO_API_KEY = originalApiKey;
    });

    test("skill list prints SDK results", async () => {
        mocks.skillsList.mockResolvedValueOnce({
            data: [{
                id: "skill-id",
                source: "WORKSPACE",
                name: "Review helper",
                description: "Reviews draft comments"
            }]
        });
        const { createProgram } = await import("../src/cli.js");
        const output: string[] = [];
        const program = createProgram({
            stdout: message => output.push(message),
            stderr: message => output.push(message)
        });

        await program.parseAsync(["node", "youvico", "skill", "list"]);

        expect(mocks.skillsList).toHaveBeenCalledWith();
        expect(output.join("\n")).toContain("skill-id");
    });

    test("skill get passes a skill ID to the SDK", async () => {
        mocks.skillsGet.mockResolvedValueOnce({
            data: {
                id: "skill-id",
                source: "WORKSPACE",
                name: "Review helper",
                description: "Reviews draft comments",
                metadata: null,
                allowedTools: null,
                license: null,
                default: null,
                versions: []
            }
        });
        const { createProgram } = await import("../src/cli.js");
        const output: string[] = [];
        const program = createProgram({
            stdout: message => output.push(message),
            stderr: message => output.push(message)
        });

        await program.parseAsync(["node", "youvico", "skill", "get", "--id", "skill-id"]);

        expect(mocks.skillsGet).toHaveBeenCalledWith("skill-id");
        expect(output.join("\n")).toContain("Review helper");
    });

    test("skill create passes metadata, allowed tools, and license to the SDK", async () => {
        mocks.skillsCreate.mockResolvedValueOnce({ data: { id: "skill-id" } });
        const { createProgram } = await import("../src/cli.js");
        const output: string[] = [];
        const program = createProgram({
            stdout: message => output.push(message),
            stderr: message => output.push(message)
        });

        await program.parseAsync([
            "node",
            "youvico",
            "skill",
            "create",
            "--name",
            "Review helper",
            "--description",
            "Reviews draft comments",
            "--metadata",
            "{\"tier\":\"internal\"}",
            "--allowed-tool",
            "slack",
            "--allowed-tool",
            "github",
            "--license",
            "MIT"
        ]);

        expect(mocks.skillsCreate).toHaveBeenCalledWith({
            name: "Review helper",
            description: "Reviews draft comments",
            metadata: {
                tier: "internal"
            },
            allowedTools: ["slack", "github"],
            license: "MIT"
        });
        expect(output.join("\n")).toContain("skill-id");
    });

    test("skill update passes only provided fields to the SDK", async () => {
        mocks.skillsUpdate.mockResolvedValueOnce(undefined);
        const { createProgram } = await import("../src/cli.js");
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
            "--description",
            "Updated description",
            "--default-version",
            "version-id"
        ]);

        expect(mocks.skillsUpdate).toHaveBeenCalledWith("skill-id", {
            description: "Updated description",
            default: {
                id: "version-id"
            }
        });
        expect(output.join("\n")).toContain("\"ok\": true");
    });

    test("skill update passes cleared optional fields to the SDK", async () => {
        mocks.skillsUpdate.mockResolvedValueOnce(undefined);
        const { createProgram } = await import("../src/cli.js");
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
            "--clear-metadata",
            "--clear-allowed-tools",
            "--clear-license"
        ]);

        expect(mocks.skillsUpdate).toHaveBeenCalledWith("skill-id", {
            metadata: null,
            allowedTools: null,
            license: null
        });
        expect(output.join("\n")).toContain("\"ok\": true");
    });

    test("skill-version publish passes inline markdown content", async () => {
        mocks.skillsPublishVersion.mockResolvedValueOnce({
            data: {
                id: "version-id",
                version: 2
            }
        });
        const { createProgram } = await import("../src/cli.js");
        const output: string[] = [];
        const program = createProgram({
            stdout: message => output.push(message),
            stderr: message => output.push(message)
        });

        await program.parseAsync([
            "node",
            "youvico",
            "skill-version",
            "publish",
            "--skill",
            "skill-id",
            "--content",
            "# Review helper\n",
            "--default"
        ]);

        expect(mocks.skillsPublishVersion).toHaveBeenCalledWith("skill-id", {
            content: "# Review helper\n",
            isDefault: true
        });
        expect(output.join("\n")).toContain("version-id");
    });

    test("skill-version publish passes note to the SDK", async () => {
        mocks.skillsPublishVersion.mockResolvedValueOnce({
            data: {
                id: "version-id",
                version: 3,
                note: "Initial public draft"
            }
        });
        const { createProgram } = await import("../src/cli.js");
        const output: string[] = [];
        const program = createProgram({
            stdout: message => output.push(message),
            stderr: message => output.push(message)
        });

        await program.parseAsync([
            "node",
            "youvico",
            "skill-version",
            "publish",
            "--skill",
            "skill-id",
            "--content",
            "# Review helper\n",
            "--note",
            "Initial public draft"
        ]);

        expect(mocks.skillsPublishVersion).toHaveBeenCalledWith("skill-id", {
            content: "# Review helper\n",
            note: "Initial public draft"
        });
        expect(output.join("\n")).toContain("Initial public draft");
    });

    test("skill-version get prints markdown response", async () => {
        mocks.skillVersionsGet.mockResolvedValueOnce({
            data: {
                markdown: "# Review helper\n"
            }
        });
        const { createProgram } = await import("../src/cli.js");
        const output: string[] = [];
        const program = createProgram({
            stdout: message => output.push(message),
            stderr: message => output.push(message)
        });

        await program.parseAsync(["node", "youvico", "skill-version", "get", "--id", "version-id"]);

        expect(mocks.skillVersionsGet).toHaveBeenCalledWith("version-id");
        expect(output.join("\n")).toContain("# Review helper");
    });

    test("skill delete and skill-version delete report success", async () => {
        mocks.skillsDelete.mockResolvedValueOnce(undefined);
        mocks.skillVersionsDelete.mockResolvedValueOnce(undefined);
        const { createProgram } = await import("../src/cli.js");
        const output: string[] = [];
        const program = createProgram({
            stdout: message => output.push(message),
            stderr: message => output.push(message)
        });

        await program.parseAsync(["node", "youvico", "skill", "delete", "--id", "skill-id"]);
        await program.parseAsync(["node", "youvico", "skill-version", "delete", "--id", "version-id"]);

        expect(mocks.skillsDelete).toHaveBeenCalledWith("skill-id");
        expect(mocks.skillVersionsDelete).toHaveBeenCalledWith("version-id");
        expect(output.join("\n")).toContain("\"ok\": true");
    });
});
