import type { Command } from "commander";

import { registerDeleteFileCommand } from "./file/delete.js";
import { registerGetFileCommand } from "./file/get.js";
import { registerListFilesCommand } from "./file/list.js";
import { registerUpdateFileCommand } from "./file/update.js";
import { registerUpdateFileTagCommand } from "./file/update-tag.js";
import { registerUploadFileCommand } from "./file/upload-file.js";
import { registerUploadYoutubeCommand } from "./file/upload-youtube.js";
import type { CommandContext } from "../lib/command.js";

export function registerFileCommands(
    program: Command,
    stdout: CommandContext["stdout"],
    stderr: CommandContext["stderr"],
    getClient: CommandContext["getClient"]
) {
    const file = program
        .command("file")
        .description("Work with files");

    const context = { program, stdout, stderr, getClient };

    file.action(() => file.outputHelp());
    registerListFilesCommand(file, context);
    registerGetFileCommand(file, context);
    registerUploadFileCommand(file, context);
    registerUploadYoutubeCommand(file, context);
    registerUpdateFileCommand(file, context);
    registerUpdateFileTagCommand(file, context);
    registerDeleteFileCommand(file, context);
}
