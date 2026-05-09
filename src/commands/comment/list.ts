import type { Command } from "commander";

import { output, run, type CommandContext } from "../../lib/command.js";

export function registerListCommentsCommand(
    comment: Command,
    context: CommandContext
) {
    comment
        .command("list")
        .description("List comments for a file")
        .requiredOption("--file <file>", "file ID")
        .option("--next <next>", "next page cursor")
        .option("--prev <prev>", "previous page cursor")
        .action(run(context.stderr, async (options) => {
            const youvico = await context.getClient();
            const result = await youvico.comments.list(options.file, {
                next: options.next,
                prev: options.prev
            });
            output(context.program, options, context.stdout, result);
        }));
}
