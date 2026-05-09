import type { Command } from "commander";

import { getAuthStatus } from "../../lib/config.js";
import type { Writer } from "../../lib/command.js";

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
                stdout("Auth is not configured.");
                return;
            }

            stdout(`Auth is configured via ${status.source === "env" ? "YOUVICO_API_KEY" : "saved config"}.`);
        });
}
