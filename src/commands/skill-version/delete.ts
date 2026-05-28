import type { Command } from "commander";

import { output, run, type CommandContext } from "../../lib/command.js";

export function registerDeleteSkillVersionCommand(
    skillVersion: Command,
    context: CommandContext
) {
    skillVersion
        .command("delete")
        .description("Delete a skill version")
        .requiredOption("--id <id>", "skill version ID")
        .action(run(context.stderr, async (options) => {
            const youvico = await context.getClient();
            await youvico.skillVersions.delete(options.id);
            output(context.program, options, context.stdout, { ok: true });
        }));
}
