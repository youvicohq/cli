import path from "node:path";

import type { Command } from "commander";

import { output, run, type CommandContext } from "../../lib/command.js";

export function registerUploadCommentAttachmentCommand(
    commentAttachment: Command,
    context: CommandContext
) {
    commentAttachment
        .command("upload")
        .description("Upload a comment attachment for a file or project")
        .option("--file <file>", "file ID")
        .option("--project <project>", "project ID")
        .requiredOption("--path <path>", "local file path")
        .option("--name <name>", "attachment name")
        .action(run(context.stderr, async (options) => {
            const target = resolveAttachmentTarget(options);
            const params = {
                name: options.name ?? path.basename(options.path),
                path: options.path
            };
            const youvico = await context.getClient();
            const result = target.type === "file"
                ? await youvico.commentAttachments.uploadForFile(target.id, params)
                : await youvico.commentAttachments.uploadForProject(target.id, params);
            output(context.program, options, context.stdout, result);
        }));
}

function resolveAttachmentTarget(options: { file?: string; project?: string }) {
    if (options.file && options.project) {
        throw new Error("Use either --file or --project, not both.");
    }
    if (options.file) {
        return { type: "file" as const, id: options.file };
    }
    if (options.project) {
        return { type: "project" as const, id: options.project };
    }

    throw new Error("Provide either --file or --project.");
}
