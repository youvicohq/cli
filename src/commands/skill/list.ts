import type { Command } from "commander";

import { output, run, type CommandContext } from "../../lib/command.js";

export function registerListSkillsCommand(
    skill: Command,
    context: CommandContext
) {
    skill
        .command("list")
        .description("List available skills")
        .action(run(context.stderr, async () => {
            const youvico = await context.getClient();
            const result = await youvico.skills.list();
            output(context.program, {}, context.stdout, result);
        }));
}
