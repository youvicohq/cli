import type { Command } from "commander";

import { output, run, type CommandContext } from "../../lib/command.js";

export function registerDeleteSkillCommand(
    skill: Command,
    context: CommandContext
) {
    skill
        .command("delete")
        .description("Delete a workspace skill")
        .requiredOption("--id <id>", "skill ID")
        .action(run(context.stderr, async (options) => {
            const youvico = await context.getClient();
            await youvico.skills.delete(options.id);
            output(context.program, options, context.stdout, { ok: true });
        }));
}
