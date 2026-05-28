import type { Command } from "commander";

import { output, run, type CommandContext } from "../../lib/command.js";

export function registerGetSkillVersionCommand(
    skillVersion: Command,
    context: CommandContext
) {
    skillVersion
        .command("get")
        .description("Get skill version markdown")
        .requiredOption("--id <id>", "skill version ID")
        .action(run(context.stderr, async (options) => {
            const youvico = await context.getClient();
            const result = await youvico.skillVersions.get(options.id);
            output(context.program, options, context.stdout, result);
        }));
}
