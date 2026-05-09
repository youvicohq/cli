import { confirm } from "@inquirer/prompts";
import type { Command } from "commander";

import { output, run, type CommandContext } from "../../lib/command.js";

export function registerDeleteFolderCommand(
    folder: Command,
    context: CommandContext
) {
    folder
        .command("delete")
        .description("Delete a folder")
        .requiredOption("--id <id>", "folder ID")
        .option("--yes", "delete without prompting")
        .option("--approve", "delete without prompting")
        .action(run(context.stderr, async (options) => {
            const skipConfirm = options.yes || options.approve;

            if (!skipConfirm) {
                const confirmed = await confirm({
                    message: `Delete folder ${options.id}?`,
                    default: false
                });

                if (!confirmed) {
                    context.stdout("Delete cancelled.");
                    return;
                }
            }

            const youvico = await context.getClient();
            await youvico.folders.delete(options.id);
            output(context.program, options, context.stdout, { ok: true });
        }));
}
