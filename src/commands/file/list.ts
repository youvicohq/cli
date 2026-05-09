import type { Command } from "commander";

import { output, run, type CommandContext } from "../../lib/command.js";

export function registerListFilesCommand(
    file: Command,
    context: CommandContext
) {
    file
        .command("list")
        .description("List files in a project")
        .requiredOption("--project <project>", "project ID")
        .action(run(context.stderr, async (options) => {
            const youvico = await context.getClient();
            const result = await youvico.files.list(options.project);
            output(context.program, options, context.stdout, result);
        }));
}
