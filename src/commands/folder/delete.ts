import type { Command } from "commander";

import { run, type CommandContext } from "../../lib/command.js";
import { confirmDestructive } from "../../lib/prompts.js";
import { formatCancelled, formatSuccess } from "../../lib/ui.js";

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
                const confirmed = await confirmDestructive({
                    action: "Delete folder",
                    target: options.id
                });

                if (!confirmed) {
                    context.stdout(formatCancelled("Delete cancelled"));
                    return;
                }
            }

            const youvico = await context.getClient();
            await youvico.folders.delete(options.id);
            context.stdout(formatSuccess("Folder deleted"));
        }));
}
