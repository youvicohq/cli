import { InvalidArgumentError, Option, type Command } from "commander";

import { output, run, type CommandContext } from "../../lib/command.js";

export function registerCreateCommentCommand(
    comment: Command,
    context: CommandContext
) {
    comment
        .command("create")
        .description("Create a comment on a file or project")
        .option("--file <file>", "file ID")
        .option("--project <project>", "project ID")
        .requiredOption("--content <content>", "comment content")
        .option("--parent <parent>", "parent comment ID for a reply")
        .addOption(new Option("--anchor <anchor>", "video timestamp in milliseconds or document page number").argParser(parseNonNegativeInteger))
        .addOption(new Option("--duration <duration>", "comment duration in the same unit as anchor").argParser(parsePositiveInteger))
        .action(run(context.stderr, async (options) => {
            const target = resolveCommentTarget(options);
            const youvico = await context.getClient();
            const parent = options.parent === undefined
                ? undefined
                : {
                        id: options.parent
                    };
            const result = target.type === "file"
                ? await youvico.comments.createForFile(target.id, {
                        content: options.content,
                        anchor: options.anchor,
                        duration: options.duration,
                        parent
                    })
                : await youvico.comments.createForProject(target.id, {
                        content: options.content,
                        parent
                    });
            output(context.program, options, context.stdout, result);
        }));
}

function resolveCommentTarget(options: { file?: string; project?: string; anchor?: number; duration?: number }) {
    if (options.file && options.project) {
        throw new Error("Use either --file or --project, not both.");
    }
    if (options.file) {
        return { type: "file" as const, id: options.file };
    }
    if (options.project) {
        if (options.anchor !== undefined || options.duration !== undefined) {
            throw new Error("Use --anchor and --duration only with --file.");
        }

        return { type: "project" as const, id: options.project };
    }

    throw new Error("Provide either --file or --project.");
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
