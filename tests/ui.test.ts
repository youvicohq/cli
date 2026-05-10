import { describe, expect, test } from "vitest";

import {
    formatCancelled,
    formatSuccess,
    formatWarning
} from "../src/lib/ui.js";

describe("ui message formatting", () => {
    test("formats success messages with detail text", () => {
        expect(formatSuccess("API key saved", "YouViCo CLI is ready to use.")).toBe([
            "✅ API key saved",
            "",
            "YouViCo CLI is ready to use."
        ].join("\n"));
    });

    test("formats warning messages with command hints", () => {
        const message = formatWarning("Authentication is not configured", [
            "Run: youvico auth api",
            "Or set: YOUVICO_API_KEY"
        ]);

        expect(message).toContain("⚠️  Authentication is not configured");
        expect(message).toContain("• Run: youvico auth api");
        expect(message).toContain("• Or set: YOUVICO_API_KEY");
    });

    test("formats cancelled messages", () => {
        expect(formatCancelled("Delete cancelled")).toBe("↩️  Delete cancelled. No changes were made.");
    });
});
