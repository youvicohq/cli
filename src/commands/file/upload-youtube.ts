import type { Command } from "commander";

import { output, run, type CommandContext } from "../../lib/command.js";

export function registerUploadYoutubeCommand(
    file: Command,
    context: CommandContext
) {
    file
        .command("upload.youtube")
        .description("Create a file from a YouTube URL")
        .requiredOption("--project <project>", "project ID")
        .requiredOption("--url <url>", "YouTube URL")
        .action(run(context.stderr, async (options) => {
            const youvico = await context.getClient();
            const result = await youvico.files.uploadYoutube(options.project, {
                url: options.url
            });
            output(context.program, options, context.stdout, result);
        }));
}
