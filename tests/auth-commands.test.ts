import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

const mocks = vi.hoisted(() => {
    const ping = vi.fn();
    const Client = vi.fn(() => ({
        ping
    }));

    return {
        Client,
        ping
    };
});

vi.mock("@youvico/api", () => ({
    Client: mocks.Client
}));

describe("auth commands", () => {
    const originalApiKey = process.env.YOUVICO_API_KEY;

    beforeEach(() => {
        process.env.YOUVICO_API_KEY = "xpi.live.djlasfnksaABCDEFG";
        mocks.Client.mockClear();
        mocks.ping.mockReset();
    });

    afterEach(() => {
        if (originalApiKey === undefined) {
            delete process.env.YOUVICO_API_KEY;
            return;
        }

        process.env.YOUVICO_API_KEY = originalApiKey;
    });

    test("auth status shows workspace and masked api key after ping succeeds", async () => {
        mocks.ping.mockResolvedValueOnce({
            data: {
                PONG: true,
                workspace: {
                    id: "workspace-id",
                    name: "Design Team",
                    avatarUrl: null
                }
            }
        });

        const { createProgram } = await import("../src/cli.js");
        const output: string[] = [];
        const program = createProgram({
            stdout: message => output.push(message),
            stderr: message => output.push(message)
        });

        await program.parseAsync(["node", "youvico", "auth", "status"]);

        const message = output.join("\n");
        expect(message).toContain("Authentication configured via YOUVICO_API_KEY");
        expect(message).toContain("Workspace: Design Team (workspace-id)");
        expect(message).toContain("API key: xpi.live.djlasfnksa....");
        expect(mocks.ping).toHaveBeenCalledOnce();
    });
});
