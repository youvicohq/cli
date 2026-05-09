import type { Command } from "commander";

import { output, run, type CommandContext } from "../../lib/command.js";

export function registerListFoldersCommand(
    folder: Command,
    context: CommandContext
) {
    folder
        .command("list")
        .description("List folders in a project")
        .requiredOption("--project <project>", "project ID")
        .action(run(context.stderr, async (options) => {
            const youvico = await context.getClient();
            const result = await youvico.folders.list(options.project);
            output(context.program, options, context.stdout, result);
        }));
}
