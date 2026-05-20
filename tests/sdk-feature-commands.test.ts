import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

const mocks = vi.hoisted(() => {
    const commentsCreate = vi.fn();
    const filesUpdate = vi.fn();
    const Client = vi.fn(() => ({
        comments: {
            create: commentsCreate
        },
        files: {
            update: filesUpdate
        }
    }));

    return {
        Client,
        commentsCreate,
        filesUpdate
    };
});

vi.mock("@youvico/api", () => ({
    Client: mocks.Client
}));

describe("SDK 1.2 command features", () => {
    const originalApiKey = process.env.YOUVICO_API_KEY;

    beforeEach(() => {
        process.env.YOUVICO_API_KEY = "xpi.live.djlasfnksaABCDEFG";
        mocks.Client.mockClear();
        mocks.commentsCreate.mockReset();
        mocks.filesUpdate.mockReset();
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
            parentId: undefined
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
            parentId: undefined
        });
        expect(output.join("\n")).toContain("comment-id");
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
});
