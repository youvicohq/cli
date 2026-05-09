import path from "node:path";

import type { Command } from "commander";

import { output, run, type CommandContext } from "../../lib/command.js";

export function registerUploadFileCommand(
    file: Command,
    context: CommandContext
) {
    file
        .command("upload.file")
        .description("Upload a local file")
        .requiredOption("--project <project>", "project ID")
        .requiredOption("--path <path>", "local file path")
        .option("--name <name>", "name to create in YouViCo")
        .action(run(context.stderr, async (options) => {
            const youvico = await context.getClient();
            const result = await youvico.files.upload(options.project, {
                name: options.name ?? path.basename(options.path),
                path: options.path
            });
            output(context.program, options, context.stdout, result);
        }));
}
