import type { Command } from "commander";

import { registerCreateReactionCommand } from "./reaction/create.js";
import { registerDeleteReactionCommand } from "./reaction/delete.js";
import { registerListReactionsCommand } from "./reaction/list.js";
import type { CommandContext } from "../lib/command.js";

export function registerReactionCommands(
    program: Command,
    stdout: CommandContext["stdout"],
    stderr: CommandContext["stderr"],
    getClient: CommandContext["getClient"]
) {
    const reaction = program
        .command("reaction")
        .description("Work with reactions");

    const context = { program, stdout, stderr, getClient };

    reaction.action(() => reaction.outputHelp());
    registerListReactionsCommand(reaction, context);
    registerCreateReactionCommand(reaction, context);
    registerDeleteReactionCommand(reaction, context);
}
