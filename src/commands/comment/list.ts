import type { Command } from "commander";

import { output, run, type CommandContext } from "../../lib/command.js";

export function registerListCommentsCommand(
    comment: Command,
    context: CommandContext
) {
    comment
        .command("list")
        .description("List comments for a file or project")
        .option("--file <file>", "file ID")
        .option("--project <project>", "project ID")
        .option("--next <next>", "next page cursor")
        .option("--prev <prev>", "previous page cursor")
        .action(run(context.stderr, async (options) => {
            const target = resolveCommentTarget(options);
            const youvico = await context.getClient();
            const cursor = {
                next: options.next,
                prev: options.prev
            };
            const result = target.type === "file"
                ? await youvico.comments.listForFile(target.id, cursor)
                : await youvico.comments.listForProject(target.id, cursor);
            output(context.program, options, context.stdout, result);
        }));
}

function resolveCommentTarget(options: { file?: string; project?: string }) {
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
