import type { Command } from "commander";

import { pingConfiguredApiKey } from "../../lib/client.js";
import { run, type Writer } from "../../lib/command.js";
import { formatSuccess } from "../../lib/ui.js";
import { formatAuthDetails } from "./format.js";

export function registerAuthPingCommand(
    auth: Command,
    stdout: Writer,
    stderr: Writer
) {
    auth
        .command("ping")
        .description("Check the configured API key against YouViCo")
        .action(run(stderr, async () => {
            const ping = await pingConfiguredApiKey();
            stdout(formatSuccess(
                "PONG",
                formatAuthDetails(ping.workspace, ping.apiKeyPreview)
            ));
        }));
}
