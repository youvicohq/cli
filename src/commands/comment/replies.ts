import type { Command } from "commander";

import { output, run, type CommandContext } from "../../lib/command.js";

export function registerListRepliesCommand(
    comment: Command,
    context: CommandContext
) {
    comment
        .command("replies")
        .description("List replies for a comment")
        .requiredOption("--comment <comment>", "comment ID")
        .option("--next <next>", "next page cursor")
        .option("--prev <prev>", "previous page cursor")
        .action(run(context.stderr, async (options) => {
            const youvico = await context.getClient();
            const result = await youvico.comments.replies(options.comment, {
                next: options.next,
                prev: options.prev
            });
            output(context.program, options, context.stdout, result);
        }));
}
