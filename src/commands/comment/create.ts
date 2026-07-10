import type { CommentAttachmentReference } from "@youvico/api";
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
        .option("--content <content>", "comment content")
        .option("--parent <parent>", "parent comment ID for a reply")
        .option("--attachment <attachment>", "uploaded comment attachment ID (repeatable)", collectAttachment)
        .addOption(new Option("--anchor <anchor>", "video timestamp in milliseconds or document page number").argParser(parseNonNegativeInteger))
        .addOption(new Option("--duration <duration>", "comment duration in the same unit as anchor").argParser(parsePositiveInteger))
        .action(run(context.stderr, async (options) => {
            const target = resolveCommentTarget(options);
            validateCommentContent(options);
            const youvico = await context.getClient();
            const parent = options.parent === undefined
                ? undefined
                : {
                        id: options.parent
                    };
            const attachments = options.attachment;
            const result = target.type === "file"
                ? await youvico.comments.createForFile(target.id, {
                        content: options.content,
                        anchor: options.anchor,
                        duration: options.duration,
                        parent,
                        attachments
                    })
                : await youvico.comments.createForProject(target.id, {
                        content: options.content,
                        parent,
                        attachments
                    });
            output(context.program, options, context.stdout, result);
        }));
}

function collectAttachment(
    id: string,
    previous: CommentAttachmentReference[] | undefined
) {
    return [...previous ?? [], { id }];
}

function validateCommentContent(options: {
    content?: string;
    anchor?: number;
    duration?: number;
    attachment?: CommentAttachmentReference[];
}) {
    if (options.duration !== undefined && options.anchor === undefined) {
        throw new Error("Use --duration only with --anchor.");
    }

    if (
        options.content === undefined &&
        options.anchor === undefined &&
        options.attachment === undefined
    ) {
        throw new Error("Provide --content, timeline options, or at least one --attachment.");
    }
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
