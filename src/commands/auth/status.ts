import type { Command } from "commander";

import { pingConfiguredApiKey } from "../../lib/client.js";
import { getAuthStatus } from "../../lib/config.js";
import { run, type Writer } from "../../lib/command.js";
import { formatSuccess, formatWarning } from "../../lib/ui.js";
import { formatAuthDetails } from "./format.js";

export function registerAuthStatusCommand(
    auth: Command,
    stdout: Writer,
    stderr: Writer
) {
    auth
        .command("status")
        .description("Report whether authentication is configured")
        .action(run(stderr, async () => {
            const status = await getAuthStatus();
            if (!status.configured) {
                stdout(formatWarning("Authentication is not configured", [
                    "Run: youvico auth api",
                    "Or set: YOUVICO_API_KEY"
                ]));
                return;
            }

            const ping = await pingConfiguredApiKey();
            stdout(formatSuccess(
                `Authentication configured via ${status.source === "env" ? "YOUVICO_API_KEY" : "saved config"}`,
                formatAuthDetails(ping.workspace, status.apiKeyPreview)
            ));
        }));
}
