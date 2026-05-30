import type { Command } from "commander";

import { run, type CommandContext } from "../../lib/command.js";
import { formatSuccess } from "../../lib/ui.js";

export function registerCancelProjectDeletionCommand(
    project: Command,
    context: CommandContext
) {
    project
        .command("delete.cancel")
        .description("Cancel scheduled project deletion")
        .requiredOption("--id <id>", "project ID")
        .action(run(context.stderr, async (options) => {
            const youvico = await context.getClient();
            await youvico.projects.cancelDeletion(options.id);
            context.stdout(formatSuccess("Project deletion cancelled"));
        }));
}
