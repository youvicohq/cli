import type { Command } from "commander";

import { clearApiKey } from "../../lib/config.js";
import type { Writer } from "../../lib/command.js";
import { formatSuccess } from "../../lib/ui.js";

export function registerAuthClearCommand(
    auth: Command,
    stdout: Writer
) {
    auth
        .command("clear")
        .description("Remove the saved API key")
        .action(async () => {
            await clearApiKey();
            stdout(formatSuccess("Saved API key removed"));
        });
}
