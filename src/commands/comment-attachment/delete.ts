import type { Command } from "commander";

import { run, type CommandContext } from "../../lib/command.js";
import { confirmDestructive } from "../../lib/prompts.js";
import { formatCancelled, formatSuccess } from "../../lib/ui.js";

export function registerDeleteCommentAttachmentCommand(
    commentAttachment: Command,
    context: CommandContext
) {
    commentAttachment
        .command("delete")
        .description("Delete a comment attachment")
        .requiredOption("--id <id>", "comment attachment ID")
        .option("--yes", "delete without prompting")
        .option("--approve", "delete without prompting")
        .action(run(context.stderr, async (options) => {
            const skipConfirm = options.yes || options.approve;

            if (!skipConfirm) {
                const confirmed = await confirmDestructive({
                    action: "Delete comment attachment",
                    target: options.id
                });

                if (!confirmed) {
                    context.stdout(formatCancelled("Delete cancelled"));
                    return;
                }
            }

            const youvico = await context.getClient();
            await youvico.commentAttachments.delete(options.id);
            context.stdout(formatSuccess("Comment attachment deleted"));
        }));
}
