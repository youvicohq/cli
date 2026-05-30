import type { Command } from "commander";

import { registerCreateCommentCommand } from "./comment/create.js";
import { registerDeleteCommentCommand } from "./comment/delete.js";
import { registerListCommentsCommand } from "./comment/list.js";
import { registerListRepliesCommand } from "./comment/replies.js";
import { registerUpdateCommentCommand } from "./comment/update.js";
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
    registerUpdateCommentCommand(comment, context);
    registerDeleteCommentCommand(comment, context);
    registerListRepliesCommand(comment, context);
}
