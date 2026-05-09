import type { Command } from "commander";

import { output, run, type CommandContext } from "../../lib/command.js";

export function registerCreateFolderCommand(
    folder: Command,
    context: CommandContext
) {
    folder
        .command("create")
        .description("Create a folder in a project")
        .requiredOption("--project <project>", "project ID")
        .requiredOption("--name <name>", "folder name")
        .action(run(context.stderr, async (options) => {
            const youvico = await context.getClient();
            const result = await youvico.folders.create(options.project, {
                name: options.name
            });
            output(context.program, options, context.stdout, result);
        }));
}
