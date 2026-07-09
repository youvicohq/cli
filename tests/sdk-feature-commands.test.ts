import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

const mocks = vi.hoisted(() => {
    const commentsDelete = vi.fn();
    const commentsCreateForFile = vi.fn();
    const commentsCreateForProject = vi.fn();
    const commentsListForFile = vi.fn();
    const commentsListForProject = vi.fn();
    const commentsUpdate = vi.fn();
    const filesUpdate = vi.fn();
    const projectsCancelDeletion = vi.fn();
    const projectsCreate = vi.fn();
    const projectsScheduleDeletion = vi.fn();
    const projectsUpdate = vi.fn();
    const Client = vi.fn(() => ({
        comments: {
            createForFile: commentsCreateForFile,
            createForProject: commentsCreateForProject,
            delete: commentsDelete,
            listForFile: commentsListForFile,
            listForProject: commentsListForProject,
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
        commentsCreateForFile,
        commentsCreateForProject,
        commentsListForFile,
        commentsListForProject,
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
        mocks.commentsCreateForFile.mockReset();
        mocks.commentsCreateForProject.mockReset();
        mocks.commentsListForFile.mockReset();
        mocks.commentsListForProject.mockReset();
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

    test("file comment create passes anchor and duration to the SDK", async () => {
        mocks.commentsCreateForFile.mockResolvedValueOnce({ data: { id: "comment-id" } });
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

        expect(mocks.commentsCreateForFile).toHaveBeenCalledWith("file-id", {
            content: "Needs a trim",
            anchor: 1200,
            duration: 3,
            parent: undefined
        });
        expect(output.join("\n")).toContain("comment-id");
    });

    test("file comment create allows a zero millisecond anchor", async () => {
        mocks.commentsCreateForFile.mockResolvedValueOnce({ data: { id: "comment-id" } });
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

        expect(mocks.commentsCreateForFile).toHaveBeenCalledWith("file-id", {
            content: "Start here",
            anchor: 0,
            duration: 1,
            parent: undefined
        });
        expect(output.join("\n")).toContain("comment-id");
    });

    test("file comment create passes a parent object for replies", async () => {
        mocks.commentsCreateForFile.mockResolvedValueOnce({ data: { id: "reply-id" } });
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

        expect(mocks.commentsCreateForFile).toHaveBeenCalledWith("file-id", {
            content: "Replying here",
            anchor: undefined,
            duration: undefined,
            parent: {
                id: "parent-comment-id"
            }
        });
        expect(output.join("\n")).toContain("reply-id");
    });

    test("project comment create calls the project comment SDK endpoint", async () => {
        mocks.commentsCreateForProject.mockResolvedValueOnce({ data: { id: "comment-id" } });
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
            "--project",
            "project-id",
            "--content",
            "Project note",
            "--parent",
            "parent-comment-id"
        ]);

        expect(mocks.commentsCreateForProject).toHaveBeenCalledWith("project-id", {
            content: "Project note",
            parent: {
                id: "parent-comment-id"
            }
        });
        expect(output.join("\n")).toContain("comment-id");
    });

    test("comment list dispatches to file and project SDK endpoints", async () => {
        mocks.commentsListForFile.mockResolvedValueOnce({ data: [], page: { next: null, prev: null } });
        mocks.commentsListForProject.mockResolvedValueOnce({ data: [], page: { next: null, prev: null } });
        const { createProgram } = await import("../src/cli.js");
        const output: string[] = [];
        const fileProgram = createProgram({
            stdout: message => output.push(message),
            stderr: message => output.push(message)
        });

        await fileProgram.parseAsync([
            "node",
            "youvico",
            "comment",
            "list",
            "--file",
            "file-id",
            "--next",
            "next-cursor"
        ]);
        const projectProgram = createProgram({
            stdout: message => output.push(message),
            stderr: message => output.push(message)
        });

        await projectProgram.parseAsync([
            "node",
            "youvico",
            "comment",
            "list",
            "--project",
            "project-id",
            "--prev",
            "prev-cursor"
        ]);

        expect(mocks.commentsListForFile).toHaveBeenCalledWith("file-id", {
            next: "next-cursor",
            prev: undefined
        });
        expect(mocks.commentsListForProject).toHaveBeenCalledWith("project-id", {
            next: undefined,
            prev: "prev-cursor"
        });
        expect(output.join("\n")).toContain("\"data\": []");
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

    test("project create passes SDK 2.0 project fields", async () => {
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
            "--access-range",
            "ONLY_PROJECT_MEMBER"
        ]);

        expect(mocks.projectsCreate).toHaveBeenCalledWith({
            name: "Launch",
            description: undefined,
            accessRange: "ONLY_PROJECT_MEMBER",
            members: undefined
        });
        expect(output.join("\n")).toContain("project-id");
    });

    test("project update passes only provided SDK 2.0 fields", async () => {
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
            "--access-range",
            "ONLY_PROJECT_MEMBER"
        ]);

        expect(mocks.projectsUpdate).toHaveBeenCalledWith("project-id", {
            description: null,
            accessRange: "ONLY_PROJECT_MEMBER"
        });
        expect(output.join("\n")).toContain("\"ok\": true");
    });

    test("project delete.schedule and delete.cancel call SDK deletion endpoints", async () => {
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

    test("comment update and delete call SDK comment endpoints", async () => {
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
