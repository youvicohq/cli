import type { Command } from "commander";

import { output, run, type CommandContext } from "../../lib/command.js";

export function registerListReactionsCommand(
    reaction: Command,
    context: CommandContext
) {
    reaction
        .command("list")
        .description("List reactions for a comment")
        .requiredOption("--comment <comment>", "comment ID")
        .action(run(context.stderr, async (options) => {
            const youvico = await context.getClient();
            const result = await youvico.reactions.list(options.comment);
            output(context.program, options, context.stdout, result);
        }));
}
