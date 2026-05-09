import type { Command } from "commander";

import { output, run, type CommandContext } from "../../lib/command.js";

export function registerGetFileCommand(
    file: Command,
    context: CommandContext
) {
    file
        .command("get")
        .description("Get a file by ID")
        .requiredOption("--id <id>", "file ID")
        .action(run(context.stderr, async (options) => {
            const youvico = await context.getClient();
            const result = await youvico.files.get(options.id);
            output(context.program, options, context.stdout, result);
        }));
}
