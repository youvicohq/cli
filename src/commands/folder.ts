import type { Command } from "commander";

import { registerCreateFolderCommand } from "./folder/create.js";
import { registerDeleteFolderCommand } from "./folder/delete.js";
import { registerListFoldersCommand } from "./folder/list.js";
import { registerUpdateFolderCommand } from "./folder/update.js";
import type { CommandContext } from "../lib/command.js";

export function registerFolderCommands(
    program: Command,
    stdout: CommandContext["stdout"],
    stderr: CommandContext["stderr"],
    getClient: CommandContext["getClient"]
) {
    const folder = program
        .command("folder")
        .description("Work with folders");

    const context = { program, stdout, stderr, getClient };

    folder.action(() => folder.outputHelp());
    registerListFoldersCommand(folder, context);
    registerCreateFolderCommand(folder, context);
    registerUpdateFolderCommand(folder, context);
    registerDeleteFolderCommand(folder, context);
}
