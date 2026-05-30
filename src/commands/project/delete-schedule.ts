import type { Command } from "commander";

import { run, type CommandContext } from "../../lib/command.js";
import { confirmDestructive } from "../../lib/prompts.js";
import { formatCancelled, formatSuccess } from "../../lib/ui.js";

export function registerScheduleProjectDeletionCommand(
    project: Command,
    context: CommandContext
) {
    project
        .command("delete.schedule")
        .description("Schedule project deletion")
        .requiredOption("--id <id>", "project ID")
        .option("--yes", "schedule deletion without prompting")
        .option("--approve", "schedule deletion without prompting")
        .action(run(context.stderr, async (options) => {
            const skipConfirm = options.yes || options.approve;

            if (!skipConfirm) {
                const confirmed = await confirmDestructive({
                    action: "Schedule project deletion",
                    target: options.id
                });

                if (!confirmed) {
                    context.stdout(formatCancelled("Delete schedule cancelled"));
                    return;
                }
            }

            const youvico = await context.getClient();
            await youvico.projects.scheduleDeletion(options.id);
            context.stdout(formatSuccess("Project deletion scheduled"));
        }));
}
