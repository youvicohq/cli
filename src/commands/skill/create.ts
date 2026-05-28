import type { CreateSkillParams } from "@youvico/api";
import { Option, type Command } from "commander";

import { output, run, type CommandContext } from "../../lib/command.js";
import { collectAllowedTool, parseMetadata } from "./options.js";

export function registerCreateSkillCommand(
    skill: Command,
    context: CommandContext
) {
    skill
        .command("create")
        .description("Create a workspace skill")
        .requiredOption("--name <name>", "skill name")
        .requiredOption("--description <description>", "skill description")
        .addOption(new Option("--metadata <json>", "JSON object with string metadata values").argParser(parseMetadata))
        .option("--allowed-tool <tool>", "allowed tool identifier (repeatable)", collectAllowedTool)
        .option("--license <license>", "skill license")
        .action(run(context.stderr, async (options) => {
            const params: CreateSkillParams = {
                name: options.name,
                description: options.description
            };

            if (options.metadata !== undefined) {
                params.metadata = options.metadata;
            }
            if (options.allowedTool !== undefined) {
                params.allowedTools = options.allowedTool;
            }
            if (options.license !== undefined) {
                params.license = options.license;
            }

            const youvico = await context.getClient();
            const result = await youvico.skills.create(params);
            output(context.program, options, context.stdout, result);
        }));
}
