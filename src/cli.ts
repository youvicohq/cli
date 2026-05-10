#!/usr/bin/env node
import { Command, CommanderError } from "commander";

import { registerAuthCommands } from "./commands/auth.js";
import { registerCommentCommands } from "./commands/comment.js";
import { registerConfigCommands } from "./commands/config.js";
import { registerFileCommands } from "./commands/file.js";
import { registerFolderCommands } from "./commands/folder.js";
import { registerProjectCommands } from "./commands/project.js";
import { registerReactionCommands } from "./commands/reaction.js";
import { createClient } from "./lib/client.js";
import { formatError } from "./lib/errors.js";
import { CLI_VERSION } from "./version.js";

export function createProgram(deps: {
    stdout?: (message: string) => void;
    stderr?: (message: string) => void;
} = {}) {
    const stdout = deps.stdout ?? (message => console.log(message));
    const stderr = deps.stderr ?? (message => console.error(message));
    let clientPromise: ReturnType<typeof createClient> | undefined;
    const getClient = () => {
        clientPromise ??= createClient();
        return clientPromise;
    };

    const program = new Command();
    program
        .name("youvico")
        .description("YouViCo command-line interface")
        .version(CLI_VERSION, "-v, --version", "print CLI version")
        .showHelpAfterError()
        .configureOutput({
            writeOut: message => stdout(message.trimEnd()),
            writeErr: message => stderr(message.trimEnd())
        });

    program
        .command("version")
        .description("Print CLI version")
        .action(() => stdout(CLI_VERSION));

    registerAuthCommands(program, stdout, stderr);
    registerConfigCommands(program, stdout, stderr);
    registerProjectCommands(program, stdout, stderr, getClient);
    registerFileCommands(program, stdout, stderr, getClient);
    registerFolderCommands(program, stdout, stderr, getClient);
    registerCommentCommands(program, stdout, stderr, getClient);
    registerReactionCommands(program, stdout, stderr, getClient);

    return program;
}

if (process.argv[1] && process.argv[1].endsWith("cli.js")) {
    createProgram().parseAsync(process.argv).catch((error: unknown) => {
        if (error instanceof CommanderError) {
            process.exitCode = error.exitCode;
            return;
        }
        console.error(formatError(error));
        process.exitCode = 1;
    });
}
