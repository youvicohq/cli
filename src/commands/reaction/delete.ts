import { confirm } from "@inquirer/prompts";
import type { Command } from "commander";

import { output, run, type CommandContext } from "../../lib/command.js";

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
                const confirmed = await confirm({
                    message: `Delete reaction ${options.type}?`,
                    default: false
                });

                if (!confirmed) {
                    context.stdout("Delete cancelled.");
                    return;
                }
            }

            const youvico = await context.getClient();
            await youvico.reactions.delete(options.comment, {
                type: options.type
            });
            output(context.program, options, context.stdout, { ok: true });
        }));
}
