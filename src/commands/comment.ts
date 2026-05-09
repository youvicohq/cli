import type { Command } from "commander";

import { registerCreateCommentCommand } from "./comment/create.js";
import { registerListCommentsCommand } from "./comment/list.js";
import { registerListRepliesCommand } from "./comment/replies.js";
import type { CommandContext } from "../lib/command.js";

export function registerCommentCommands(
    program: Command,
    stdout: CommandContext["stdout"],
    stderr: CommandContext["stderr"],
    getClient: CommandContext["getClient"]
) {
    const comment = program
        .command("comment")
        .description("Work with comments");

    const context = { program, stdout, stderr, getClient };

    comment.action(() => comment.outputHelp());
    registerListCommentsCommand(comment, context);
    registerCreateCommentCommand(comment, context);
    registerListRepliesCommand(comment, context);
}
