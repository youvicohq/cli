import { InvalidArgumentError, Option, type Command } from "commander";

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
        .addOption(new Option("--anchor <anchor>", "video timestamp in milliseconds or document page number").argParser(parseNonNegativeInteger))
        .addOption(new Option("--duration <duration>", "comment duration in the same unit as anchor").argParser(parsePositiveInteger))
        .action(run(context.stderr, async (options) => {
            const youvico = await context.getClient();
            const result = await youvico.comments.create(options.file, {
                content: options.content,
                anchor: options.anchor,
                duration: options.duration,
                parent: options.parent === undefined
                    ? undefined
                    : {
                            id: options.parent
                        }
            });
            output(context.program, options, context.stdout, result);
        }));
}

function parseNonNegativeInteger(value: string) {
    const parsed = Number(value);
    if (!Number.isInteger(parsed) || parsed < 0) {
        throw new InvalidArgumentError("must be a non-negative integer");
    }
    return parsed;
}

function parsePositiveInteger(value: string) {
    const parsed = Number(value);
    if (!Number.isInteger(parsed) || parsed <= 0) {
        throw new InvalidArgumentError("must be a positive integer");
    }
    return parsed;
}
