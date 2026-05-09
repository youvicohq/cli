import type { Command } from "commander";

import { registerGetProjectCommand } from "./project/get.js";
import { registerSearchProjectsCommand } from "./project/search.js";
import type { CommandContext } from "../lib/command.js";

export function registerProjectCommands(
    program: Command,
    stdout: CommandContext["stdout"],
    stderr: CommandContext["stderr"],
    getClient: CommandContext["getClient"]
) {
    const project = program
        .command("project")
        .description("Work with projects");

    const context = { program, stdout, stderr, getClient };

    project.action(() => project.outputHelp());
    registerSearchProjectsCommand(project, context);
    registerGetProjectCommand(project, context);
}
