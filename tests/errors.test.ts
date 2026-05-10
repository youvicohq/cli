import { describe, expect, test } from "vitest";

import { formatError } from "../src/lib/errors.js";

describe("formatError", () => {
    test("maps 401 to a rich authentication message with next steps", () => {
        const message = formatError(Object.assign(new Error("API key expired."), { status: 401 }));

        expect(message).toContain("❌ Authentication failed");
        expect(message).toContain("API key expired.");
        expect(message).toContain("youvico auth api");
    });

    test("maps 403 to a rich permission message using the server message", () => {
        const message = formatError(Object.assign(new Error("You cannot access this project."), { status: 403 }));

        expect(message).toContain("❌ Request forbidden");
        expect(message).toContain("You cannot access this project.");
    });

    test("uses server messages for other API errors", () => {
        const message = formatError(Object.assign(new Error("File not found."), { status: 404, code: "FILE_NOT_FOUND" }));

        expect(message).toContain("❌ API request failed");
        expect(message).toContain("File not found.");
        expect(message).toContain("Code: FILE_NOT_FOUND");
    });

    test("maps timeout and network failures with retry hints", () => {
        const message = formatError(Object.assign(new Error("boom"), { code: "ETIMEDOUT" }));

        expect(message).toContain("❌ Network error");
        expect(message).toContain("connection timed out");
        expect(message).toContain("youvico config set --timeout-ms 60000");
    });

    test("formats local validation errors without branding them as API failures", () => {
        const message = formatError(new Error("Provide at least one config option: --base-url or --timeout-ms."));

        expect(message).toContain("❌ Command failed");
        expect(message).toContain("Provide at least one config option");
        expect(message).not.toContain("YouViCo error");
    });
});
