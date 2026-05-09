import type { Command } from "commander";

import { output, run, type CommandContext } from "../../lib/command.js";

export function registerGetProjectCommand(
    project: Command,
    context: CommandContext
) {
    project
        .command("get")
        .description("Get a project by ID")
        .requiredOption("--id <id>", "project ID")
        .action(run(context.stderr, async (options) => {
            const youvico = await context.getClient();
            const result = await youvico.projects.get(options.id);
            output(context.program, options, context.stdout, result);
        }));
}
