import { describe, expect, test, vi } from "vitest";

const mocks = vi.hoisted(() => {
    const ping = vi.fn();
    const search = vi.fn();
    const Client = vi.fn(() => ({
        ping,
        projects: {
            search
        }
    }));

    return {
        Client,
        ping,
        search
    };
});

vi.mock("@youvico/api", () => ({
    Client: mocks.Client
}));

describe("auth ping client", () => {
    test("validates an api key with the SDK ping endpoint", async () => {
        const pingResult = {
            data: {
                PONG: true,
                workspace: {
                    id: "workspace-id",
                    name: "Design Team",
                    avatarUrl: null
                }
            }
        };
        mocks.ping.mockResolvedValueOnce(pingResult);
        const { validateApiKey } = await import("../src/lib/client.js");

        await expect(validateApiKey("xpi.live.djlasfnksa")).resolves.toEqual(pingResult.data);

        expect(mocks.Client).toHaveBeenCalledWith(expect.objectContaining({
            apiKey: "xpi.live.djlasfnksa"
        }));
        expect(mocks.ping).toHaveBeenCalledOnce();
        expect(mocks.search).not.toHaveBeenCalled();
    });
});
