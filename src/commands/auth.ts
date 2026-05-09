import type { Command } from "commander";

import { registerAuthApiCommand } from "./auth/api.js";
import { registerAuthClearCommand } from "./auth/clear.js";
import { registerAuthStatusCommand } from "./auth/status.js";
import type { Writer } from "../lib/command.js";

export function registerAuthCommands(
    program: Command,
    stdout: Writer,
    stderr: Writer
) {
    const auth = program
        .command("auth")
        .description("Manage YouViCo API authentication");

    auth.action(() => auth.outputHelp());
    registerAuthApiCommand(auth, stdout, stderr);
    registerAuthClearCommand(auth, stdout);
    registerAuthStatusCommand(auth, stdout);
}
