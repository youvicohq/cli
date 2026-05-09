import type { Command } from "commander";

import { registerClearConfigCommand } from "./config/clear.js";
import { registerGetConfigCommand } from "./config/get.js";
import { registerSetConfigCommand } from "./config/set.js";
import type { Writer } from "../lib/command.js";

export function registerConfigCommands(
    program: Command,
    stdout: Writer,
    stderr: Writer
) {
    const config = program
        .command("config")
        .description("Manage YouViCo CLI configuration");

    config.action(() => config.outputHelp());
    registerGetConfigCommand(config, stdout, stderr);
    registerSetConfigCommand(config, stdout, stderr);
    registerClearConfigCommand(config, stdout, stderr);
}
