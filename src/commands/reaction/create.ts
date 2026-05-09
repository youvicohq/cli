import type { Command } from "commander";

import { output, run, type CommandContext } from "../../lib/command.js";

export function registerCreateReactionCommand(
    reaction: Command,
    context: CommandContext
) {
    reaction
        .command("create")
        .description("Create a reaction for a comment")
        .requiredOption("--comment <comment>", "comment ID")
        .requiredOption("--type <type>", "emoji reaction")
        .action(run(context.stderr, async (options) => {
            const youvico = await context.getClient();
            await youvico.reactions.create(options.comment, {
                type: options.type
            });
            output(context.program, options, context.stdout, { ok: true });
        }));
}
