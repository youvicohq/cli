import { describe, expect, test } from "vitest";

import { formatError } from "../src/lib/errors.js";

describe("formatError", () => {
    test("maps 401 to an authentication message", () => {
        expect(formatError({ statusCode: 401 })).toContain("invalid or missing API key");
    });

    test("maps 403 to a permission message", () => {
        expect(formatError({ status: 403 })).toContain("insufficient permission");
    });

    test("maps timeout and network failures", () => {
        expect(formatError(Object.assign(new Error("boom"), { code: "ETIMEDOUT" }))).toContain(
            "connection timed out"
        );
    });
});
