import type { UpdateSkillParams } from "@youvico/api";
import { Option, type Command } from "commander";

import { output, run, type CommandContext } from "../../lib/command.js";
import { collectAllowedTool, parseMetadata } from "./options.js";

export function registerUpdateSkillCommand(
    skill: Command,
    context: CommandContext
) {
    skill
        .command("update")
        .description("Update a workspace skill")
        .requiredOption("--id <id>", "skill ID")
        .option("--name <name>", "skill name")
        .option("--description <description>", "skill description")
        .addOption(new Option("--metadata <json>", "JSON object with string metadata values").argParser(parseMetadata))
        .option("--allowed-tool <tool>", "allowed tool identifier (repeatable)", collectAllowedTool)
        .option("--license <license>", "skill license")
        .option("--default-version <version>", "default skill version ID")
        .action(run(context.stderr, async (options) => {
            const updates: UpdateSkillParams = {};

            if (options.name !== undefined) {
                updates.name = options.name;
            }
            if (options.description !== undefined) {
                updates.description = options.description;
            }
            if (options.metadata !== undefined) {
                updates.metadata = options.metadata;
            }
            if (options.allowedTool !== undefined) {
                updates.allowedTools = options.allowedTool;
            }
            if (options.license !== undefined) {
                updates.license = options.license;
            }
            if (options.defaultVersion !== undefined) {
                updates.default = {
                    id: options.defaultVersion
                };
            }

            if (Object.keys(updates).length === 0) {
                throw new Error("Provide at least one update option: --name, --description, --metadata, --allowed-tool, --license, or --default-version.");
            }

            const youvico = await context.getClient();
            await youvico.skills.update(options.id, updates);
            output(context.program, options, context.stdout, { ok: true });
        }));
}
