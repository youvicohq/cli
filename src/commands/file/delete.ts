import type { Command } from "commander";

import { run, type CommandContext } from "../../lib/command.js";
import { confirmDestructive } from "../../lib/prompts.js";
import { formatCancelled, formatSuccess } from "../../lib/ui.js";

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
                const confirmed = await confirmDestructive({
                    action: "Delete file",
                    target: options.id
                });

                if (!confirmed) {
                    context.stdout(formatCancelled("Delete cancelled"));
                    return;
                }
            }

            const youvico = await context.getClient();
            await youvico.files.delete(options.id);
            context.stdout(formatSuccess("File deleted"));
        }));
}
