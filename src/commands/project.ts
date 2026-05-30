import type { Command } from "commander";

import { registerCancelProjectDeletionCommand } from "./project/delete-cancel.js";
import { registerCreateProjectCommand } from "./project/create.js";
import { registerGetProjectCommand } from "./project/get.js";
import { registerSearchProjectsCommand } from "./project/search.js";
import { registerScheduleProjectDeletionCommand } from "./project/delete-schedule.js";
import { registerUpdateProjectCommand } from "./project/update.js";
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
    registerCreateProjectCommand(project, context);
    registerSearchProjectsCommand(project, context);
    registerGetProjectCommand(project, context);
    registerUpdateProjectCommand(project, context);
    registerScheduleProjectDeletionCommand(project, context);
    registerCancelProjectDeletionCommand(project, context);
}
