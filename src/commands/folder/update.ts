import type { Command } from "commander";

import { output, run, type CommandContext } from "../../lib/command.js";

export function registerUpdateFolderCommand(
    folder: Command,
    context: CommandContext
) {
    folder
        .command("update")
        .description("Update a folder")
        .requiredOption("--id <id>", "folder ID")
        .requiredOption("--name <name>", "folder name")
        .action(run(context.stderr, async (options) => {
            const youvico = await context.getClient();
            await youvico.folders.update(options.id, {
                name: options.name
            });
            output(context.program, options, context.stdout, { ok: true });
        }));
}
