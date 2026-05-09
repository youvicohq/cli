import type { Command } from "commander";

import { output, run, type CommandContext } from "../../lib/command.js";

export function registerCreateCommentCommand(
    comment: Command,
    context: CommandContext
) {
    comment
        .command("create")
        .description("Create a comment on a file")
        .requiredOption("--file <file>", "file ID")
        .requiredOption("--content <content>", "comment content")
        .option("--parent <parent>", "parent comment ID for a reply")
        .action(run(context.stderr, async (options) => {
            const youvico = await context.getClient();
            const result = await youvico.comments.create(options.file, {
                content: options.content,
                parentId: options.parent
            });
            output(context.program, options, context.stdout, result);
        }));
}
