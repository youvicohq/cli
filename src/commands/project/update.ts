import type { ProjectAccessRange, UpdateProjectParams } from "@youvico/api";
import { Option, type Command } from "commander";

import { output, run, type CommandContext } from "../../lib/command.js";
import { projectAccessRanges } from "./options.js";

export function registerUpdateProjectCommand(
    project: Command,
    context: CommandContext
) {
    project
        .command("update")
        .description("Update project metadata")
        .requiredOption("--id <id>", "project ID")
        .option("--name <name>", "project name")
        .option("--description <description>", "project description")
        .option("--clear-description", "clear project description")
        .addOption(new Option("--access-range <accessRange>", "project access policy").choices(projectAccessRanges))
        .action(run(context.stderr, async (options) => {
            if (options.description !== undefined && options.clearDescription) {
                throw new Error("Use either --description or --clear-description, not both.");
            }

            const updates: UpdateProjectParams = {};

            if (options.name !== undefined) {
                updates.name = options.name;
            }
            if (options.clearDescription) {
                updates.description = null;
            }
            else if (options.description !== undefined) {
                updates.description = options.description;
            }
            if (options.accessRange !== undefined) {
                updates.accessRange = options.accessRange as ProjectAccessRange;
            }

            if (Object.keys(updates).length === 0) {
                throw new Error("Provide at least one update option: --name, --description, --clear-description, or --access-range.");
            }

            const youvico = await context.getClient();
            await youvico.projects.update(options.id, updates);
            output(context.program, options, context.stdout, { ok: true });
        }));
}
