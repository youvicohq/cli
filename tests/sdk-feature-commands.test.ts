import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

const mocks = vi.hoisted(() => {
    const commentsDelete = vi.fn();
    const commentsCreate = vi.fn();
    const commentsUpdate = vi.fn();
    const filesUpdate = vi.fn();
    const projectsCancelDeletion = vi.fn();
    const projectsCreate = vi.fn();
    const projectsScheduleDeletion = vi.fn();
    const projectsUpdate = vi.fn();
    const Client = vi.fn(() => ({
        comments: {
            create: commentsCreate,
            delete: commentsDelete,
            update: commentsUpdate
        },
        files: {
            update: filesUpdate
        },
        projects: {
            cancelDeletion: projectsCancelDeletion,
            create: projectsCreate,
            scheduleDeletion: projectsScheduleDeletion,
            update: projectsUpdate
        }
    }));

    return {
        Client,
        commentsDelete,
        commentsCreate,
        commentsUpdate,
        filesUpdate,
        projectsCancelDeletion,
        projectsCreate,
        projectsScheduleDeletion,
        projectsUpdate
    };
});

vi.mock("@youvico/api", () => ({
    Client: mocks.Client
}));

describe("SDK feature commands", () => {
    const originalApiKey = process.env.YOUVICO_API_KEY;

    beforeEach(() => {
        process.env.YOUVICO_API_KEY = "xpi.live.djlasfnksaABCDEFG";
        mocks.Client.mockClear();
        mocks.commentsDelete.mockReset();
        mocks.commentsCreate.mockReset();
        mocks.commentsUpdate.mockReset();
        mocks.filesUpdate.mockReset();
        mocks.projectsCancelDeletion.mockReset();
        mocks.projectsCreate.mockReset();
        mocks.projectsScheduleDeletion.mockReset();
        mocks.projectsUpdate.mockReset();
    });

    afterEach(() => {
        process.exitCode = undefined;

        if (originalApiKey === undefined) {
            delete process.env.YOUVICO_API_KEY;
            return;
        }

        process.env.YOUVICO_API_KEY = originalApiKey;
    });

    test("comment create passes anchor and duration to the SDK", async () => {
        mocks.commentsCreate.mockResolvedValueOnce({ data: { id: "comment-id" } });
        const { createProgram } = await import("../src/cli.js");
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
            "--content",
            "Needs a trim",
            "--anchor",
            "1200",
            "--duration",
            "3"
        ]);

        expect(mocks.commentsCreate).toHaveBeenCalledWith("file-id", {
            content: "Needs a trim",
            anchor: 1200,
            duration: 3,
            parent: undefined
        });
        expect(output.join("\n")).toContain("comment-id");
    });

    test("comment create allows a zero millisecond anchor", async () => {
        mocks.commentsCreate.mockResolvedValueOnce({ data: { id: "comment-id" } });
        const { createProgram } = await import("../src/cli.js");
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
            "--content",
            "Start here",
            "--anchor",
            "0",
            "--duration",
            "1"
        ]);

        expect(mocks.commentsCreate).toHaveBeenCalledWith("file-id", {
            content: "Start here",
            anchor: 0,
            duration: 1,
            parent: undefined
        });
        expect(output.join("\n")).toContain("comment-id");
    });

    test("comment create passes a parent object for replies", async () => {
        mocks.commentsCreate.mockResolvedValueOnce({ data: { id: "reply-id" } });
        const { createProgram } = await import("../src/cli.js");
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
            "--content",
            "Replying here",
            "--parent",
            "parent-comment-id"
        ]);

        expect(mocks.commentsCreate).toHaveBeenCalledWith("file-id", {
            content: "Replying here",
            anchor: undefined,
            duration: undefined,
            parent: {
                id: "parent-comment-id"
            }
        });
        expect(output.join("\n")).toContain("reply-id");
    });

    test("file update passes a folder assignment to the SDK", async () => {
        mocks.filesUpdate.mockResolvedValueOnce(undefined);
        const { createProgram } = await import("../src/cli.js");
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
            "folder-id"
        ]);

        expect(mocks.filesUpdate).toHaveBeenCalledWith("file-id", {
            folder: {
                id: "folder-id"
            }
        });
        expect(output.join("\n")).toContain("\"ok\": true");
    });

    test("file update passes folder clearing to the SDK", async () => {
        mocks.filesUpdate.mockResolvedValueOnce(undefined);
        const { createProgram } = await import("../src/cli.js");
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
            "--clear-folder"
        ]);

        expect(mocks.filesUpdate).toHaveBeenCalledWith("file-id", {
            folder: null
        });
        expect(output.join("\n")).toContain("\"ok\": true");
    });

    test("project create passes SDK 1.6 project fields", async () => {
        mocks.projectsCreate.mockResolvedValueOnce({ data: { id: "project-id" } });
        const { createProgram } = await import("../src/cli.js");
        const output: string[] = [];
        const program = createProgram({
            stdout: message => output.push(message),
            stderr: message => output.push(message)
        });

        await program.parseAsync([
            "node",
            "youvico",
            "project",
            "create",
            "--name",
            "Launch",
            "--deadline",
            "2026-06-30",
            "--description",
            "Campaign launch",
            "--access-range",
            "ALLOW_WORKSPACE_MEMBER",
            "--member",
            "user-1:PROJECT_MANAGER",
            "--member",
            "user-2:PROJECT_REVIEWER"
        ]);

        expect(mocks.projectsCreate).toHaveBeenCalledWith({
            name: "Launch",
            deadline: "2026-06-30",
            description: "Campaign launch",
            accessRange: "ALLOW_WORKSPACE_MEMBER",
            members: [
                {
                    user: {
                        id: "user-1"
                    },
                    role: "PROJECT_MANAGER"
                },
                {
                    user: {
                        id: "user-2"
                    },
                    role: "PROJECT_REVIEWER"
                }
            ]
        });
        expect(output.join("\n")).toContain("project-id");
    });

    test("project create leaves members undefined when no member is provided", async () => {
        mocks.projectsCreate.mockResolvedValueOnce({ data: { id: "project-id" } });
        const { createProgram } = await import("../src/cli.js");
        const output: string[] = [];
        const program = createProgram({
            stdout: message => output.push(message),
            stderr: message => output.push(message)
        });

        await program.parseAsync([
            "node",
            "youvico",
            "project",
            "create",
            "--name",
            "Launch",
            "--deadline",
            "2026-06-30",
            "--access-range",
            "ONLY_PROJECT_MEMBER"
        ]);

        expect(mocks.projectsCreate).toHaveBeenCalledWith({
            name: "Launch",
            deadline: "2026-06-30",
            description: undefined,
            accessRange: "ONLY_PROJECT_MEMBER",
            members: undefined
        });
        expect(output.join("\n")).toContain("project-id");
    });

    test("project update passes only provided SDK 1.6 fields", async () => {
        mocks.projectsUpdate.mockResolvedValueOnce(undefined);
        const { createProgram } = await import("../src/cli.js");
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
            "--clear-description",
            "--deadline",
            "2026-07-15",
            "--access-range",
            "ONLY_PROJECT_MEMBER"
        ]);

        expect(mocks.projectsUpdate).toHaveBeenCalledWith("project-id", {
            description: null,
            deadline: "2026-07-15",
            accessRange: "ONLY_PROJECT_MEMBER"
        });
        expect(output.join("\n")).toContain("\"ok\": true");
    });

    test("project delete.schedule and delete.cancel call SDK 1.6 deletion endpoints", async () => {
        mocks.projectsScheduleDeletion.mockResolvedValueOnce(undefined);
        mocks.projectsCancelDeletion.mockResolvedValueOnce(undefined);
        const { createProgram } = await import("../src/cli.js");
        const output: string[] = [];
        const program = createProgram({
            stdout: message => output.push(message),
            stderr: message => output.push(message)
        });

        await program.parseAsync(["node", "youvico", "project", "delete.schedule", "--id", "project-id", "--yes"]);
        await program.parseAsync(["node", "youvico", "project", "delete.cancel", "--id", "project-id"]);

        expect(mocks.projectsScheduleDeletion).toHaveBeenCalledWith("project-id");
        expect(mocks.projectsCancelDeletion).toHaveBeenCalledWith("project-id");
        expect(output.join("\n")).toContain("Project deletion scheduled");
        expect(output.join("\n")).toContain("Project deletion cancelled");
    });

    test("comment update and delete call SDK 1.6 comment endpoints", async () => {
        mocks.commentsUpdate.mockResolvedValueOnce(undefined);
        mocks.commentsDelete.mockResolvedValueOnce(undefined);
        const { createProgram } = await import("../src/cli.js");
        const output: string[] = [];
        const program = createProgram({
            stdout: message => output.push(message),
            stderr: message => output.push(message)
        });

        await program.parseAsync([
            "node",
            "youvico",
            "comment",
            "update",
            "--id",
            "comment-id",
            "--content",
            "Updated note"
        ]);
        await program.parseAsync(["node", "youvico", "comment", "delete", "--id", "comment-id", "--yes"]);

        expect(mocks.commentsUpdate).toHaveBeenCalledWith("comment-id", {
            content: "Updated note"
        });
        expect(mocks.commentsDelete).toHaveBeenCalledWith("comment-id");
        expect(output.join("\n")).toContain("\"ok\": true");
        expect(output.join("\n")).toContain("Comment deleted");
    });
});
