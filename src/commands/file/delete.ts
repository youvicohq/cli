import { confirm } from "@inquirer/prompts";
import type { Command } from "commander";

import { output, run, type CommandContext } from "../../lib/command.js";

export function registerDeleteFileCommand(
    file: Command,
    context: CommandContext
) {
    file
        .command("delete")
        .description("Delete a file")
        .requiredOption("--id <id>", "file ID")
        .option("--yes", "delete without prompting")
        .option("--approve", "delete without prompting")
        .action(run(context.stderr, async (options) => {
            const skipConfirm = options.yes || options.approve;

            if (!skipConfirm) {
                const confirmed = await confirm({
                    message: `Delete file ${options.id}?`,
                    default: false
                });

                if (!confirmed) {
                    context.stdout("Delete cancelled.");
                    return;
                }
            }

            const youvico = await context.getClient();
            await youvico.files.delete(options.id);
            output(context.program, options, context.stdout, { ok: true });
        }));
}
