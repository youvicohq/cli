import type { PublishSkillVersionParams } from "@youvico/api";
import type { Command } from "commander";

import { output, run, type CommandContext } from "../../lib/command.js";

export function registerPublishSkillVersionCommand(
    skillVersion: Command,
    context: CommandContext
) {
    skillVersion
        .command("publish")
        .description("Publish a skill version")
        .requiredOption("--skill <skill>", "skill ID")
        .requiredOption("--content <content>", "skill markdown content")
        .option("--default", "make this version the default")
        .action(run(context.stderr, async (options) => {
            const params: PublishSkillVersionParams = {
                content: options.content
            };

            if (options.default) {
                params.isDefault = true;
            }

            const youvico = await context.getClient();
            const result = await youvico.skills.publishVersion(options.skill, params);
            output(context.program, options, context.stdout, result);
        }));
}
