import { password } from "@inquirer/prompts";
import type { Command } from "commander";

import { validateApiKey } from "../../lib/client.js";
import { writeApiKey } from "../../lib/config.js";
import { run, type Writer } from "../../lib/command.js";

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

            await validateApiKey(apiKey);
            await writeApiKey(apiKey);
            stdout("API key saved.");
        }));
}
