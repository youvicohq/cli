import type { Command } from "commander";

import { output, run, type CommandContext } from "../../lib/command.js";

export function registerGetSkillCommand(
    skill: Command,
    context: CommandContext
) {
    skill
        .command("get")
        .description("Get a skill by ID")
        .requiredOption("--id <id>", "skill ID")
        .action(run(context.stderr, async (options) => {
            const youvico = await context.getClient();
            const result = await youvico.skills.get(options.id);
            output(context.program, options, context.stdout, result);
        }));
}
