import type { FileTag } from "@youvico/api";
import { Option, type Command } from "commander";

import { output, run, type CommandContext } from "../../lib/command.js";

const fileTags = [
    "IN_PROGRESS",
    "NEED_REVIEW",
    "NEED_EDIT",
    "ON_HOLD",
    "APPROVED",
    "REJECTED",
    "CLOSED"
];

export function registerUpdateFileTagCommand(
    file: Command,
    context: CommandContext
) {
    file
        .command("update.tag")
        .description("Update file review tag")
        .requiredOption("--id <id>", "file ID")
        .addOption(new Option("--tag <tag>", "file tag").choices(fileTags).makeOptionMandatory())
        .action(run(context.stderr, async (options) => {
            const youvico = await context.getClient();
            await youvico.files.updateTag(options.id, {
                tag: options.tag as FileTag
            });
            output(context.program, options, context.stdout, { ok: true });
        }));
}
