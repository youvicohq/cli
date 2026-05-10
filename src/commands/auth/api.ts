import { password } from "@inquirer/prompts";
import type { Command } from "commander";

import { validateApiKey } from "../../lib/client.js";
import { maskApiKey, writeApiKey } from "../../lib/config.js";
import { run, type Writer } from "../../lib/command.js";
import { formatSuccess } from "../../lib/ui.js";
import { formatAuthDetails } from "./format.js";

export function registerAuthApiCommand(
    auth: Command,
    stdout: Writer,
    stderr: Writer
) {
    auth
        .command("api")
        .description("Prompt for, validate, and save an API key")
        .action(run(stderr, async () => {
            const apiKey = await password({
                message: "YouViCo API key",
                mask: "*"
            });

            const ping = await validateApiKey(apiKey);
            await writeApiKey(apiKey);
            stdout(formatSuccess(
                "API key saved",
                [
                    "YouViCo CLI is ready to use.",
                    "",
                    formatAuthDetails(ping.workspace, maskApiKey(apiKey))
                ].join("\n")
            ));
        }));
}
