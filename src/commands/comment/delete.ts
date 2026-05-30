import type { Command } from "commander";

import { run, type CommandContext } from "../../lib/command.js";
import { confirmDestructive } from "../../lib/prompts.js";
import { formatCancelled, formatSuccess } from "../../lib/ui.js";

export function registerDeleteCommentCommand(
    comment: Command,
    context: CommandContext
) {
    comment
        .command("delete")
        .description("Delete a comment")
        .requiredOption("--id <id>", "comment ID")
        .option("--yes", "delete without prompting")
        .option("--approve", "delete without prompting")
        .action(run(context.stderr, async (options) => {
            const skipConfirm = options.yes || options.approve;

            if (!skipConfirm) {
                const confirmed = await confirmDestructive({
                    action: "Delete comment",
                    target: options.id
                });

                if (!confirmed) {
                    context.stdout(formatCancelled("Delete cancelled"));
                    return;
                }
            }

            const youvico = await context.getClient();
            await youvico.comments.delete(options.id);
            context.stdout(formatSuccess("Comment deleted"));
        }));
}
