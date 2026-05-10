import type { Command } from "commander";

import { getAuthStatus } from "../../lib/config.js";
import type { Writer } from "../../lib/command.js";
import { formatSuccess, formatWarning } from "../../lib/ui.js";

export function registerAuthStatusCommand(
    auth: Command,
    stdout: Writer
) {
    auth
        .command("status")
        .description("Report whether authentication is configured")
        .action(async () => {
            const status = await getAuthStatus();
            if (!status.configured) {
                stdout(formatWarning("Authentication is not configured", [
                    "Run: youvico auth api",
                    "Or set: YOUVICO_API_KEY"
                ]));
                return;
            }

            stdout(formatSuccess(`Authentication configured via ${status.source === "env" ? "YOUVICO_API_KEY" : "saved config"}`));
        });
}
