import type { Command } from "commander";

import { registerDeleteCommentAttachmentCommand } from "./comment-attachment/delete.js";
import { registerUploadCommentAttachmentCommand } from "./comment-attachment/upload.js";
import type { CommandContext } from "../lib/command.js";

export function registerCommentAttachmentCommands(
    program: Command,
    stdout: CommandContext["stdout"],
    stderr: CommandContext["stderr"],
    getClient: CommandContext["getClient"]
) {
    const commentAttachment = program
        .command("comment-attachment")
        .description("Work with comment attachments");

    const context = { program, stdout, stderr, getClient };

    commentAttachment.action(() => commentAttachment.outputHelp());
    registerUploadCommentAttachmentCommand(commentAttachment, context);
    registerDeleteCommentAttachmentCommand(commentAttachment, context);
}
