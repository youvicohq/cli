import type { CreateProjectParams, ProjectAccessRange } from "@youvico/api";
import { Option, type Command } from "commander";

import { output, run, type CommandContext } from "../../lib/command.js";
import { collectProjectMember, projectAccessRanges } from "./options.js";

export function registerCreateProjectCommand(
    project: Command,
    context: CommandContext
) {
    project
        .command("create")
        .description("Create a project")
        .requiredOption("--name <name>", "project name")
        .requiredOption("--deadline <deadline>", "deadline date in YYYY-MM-DD format")
        .option("--description <description>", "project description")
        .addOption(new Option("--access-range <accessRange>", "project access policy").choices(projectAccessRanges).makeOptionMandatory())
        .option("--member <member>", "project member as userId:role (repeatable)", collectProjectMember)
        .action(run(context.stderr, async (options) => {
            const params: CreateProjectParams = {
                name: options.name,
                deadline: options.deadline,
                description: options.description,
                members: options.member ?? [],
                accessRange: options.accessRange as ProjectAccessRange
            };

            const youvico = await context.getClient();
            const result = await youvico.projects.create(params);
            output(context.program, options, context.stdout, result);
        }));
}
