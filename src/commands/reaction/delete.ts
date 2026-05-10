import type { Command } from "commander";

import { run, type CommandContext } from "../../lib/command.js";
import { confirmDestructive } from "../../lib/prompts.js";
import { formatCancelled, formatSuccess } from "../../lib/ui.js";

export function registerDeleteReactionCommand(
    reaction: Command,
    context: CommandContext
) {
    reaction
        .command("delete")
        .description("Delete a reaction from a comment")
        .requiredOption("--comment <comment>", "comment ID")
        .requiredOption("--type <type>", "emoji reaction")
        .option("--yes", "delete without prompting")
        .option("--approve", "delete without prompting")
        .action(run(context.stderr, async (options) => {
            const skipConfirm = options.yes || options.approve;

            if (!skipConfirm) {
                const confirmed = await confirmDestructive({
                    action: "Delete reaction",
                    target: options.type
                });

                if (!confirmed) {
                    context.stdout(formatCancelled("Delete cancelled"));
                    return;
                }
            }

            const youvico = await context.getClient();
            await youvico.reactions.delete(options.comment, {
                type: options.type
            });
            context.stdout(formatSuccess("Reaction deleted"));
        }));
}
