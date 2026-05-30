import type { Command } from "commander";

import { output, run, type CommandContext } from "../../lib/command.js";

export function registerUpdateCommentCommand(
    comment: Command,
    context: CommandContext
) {
    comment
        .command("update")
        .description("Update a comment")
        .requiredOption("--id <id>", "comment ID")
        .requiredOption("--content <content>", "comment content")
        .action(run(context.stderr, async (options) => {
            const youvico = await context.getClient();
            await youvico.comments.update(options.id, {
                content: options.content
            });
            output(context.program, options, context.stdout, { ok: true });
        }));
}
