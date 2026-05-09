import type { Command } from "commander";

import { output, run, type CommandContext } from "../../lib/command.js";

export function registerUpdateFileCommand(
    file: Command,
    context: CommandContext
) {
    file
        .command("update")
        .description("Update file metadata")
        .requiredOption("--id <id>", "file ID")
        .option("--name <name>", "file name")
        .option("--description <description>", "file description")
        .option("--clear-description", "clear file description")
        .option("--allow-restricted", "allow restricted users")
        .action(run(context.stderr, async (options) => {
            if (options.description !== undefined && options.clearDescription) {
                throw new Error("Use either --description or --clear-description, not both.");
            }

            const updates: {
                name?: string;
                description?: string | null;
                allowRestricted?: boolean;
            } = {};

            if (options.name !== undefined) {
                updates.name = options.name;
            }
            if (options.clearDescription) {
                updates.description = null;
            }
            else if (options.description !== undefined) {
                updates.description = options.description;
            }
            if (options.allowRestricted) {
                updates.allowRestricted = true;
            }

            if (Object.keys(updates).length === 0) {
                throw new Error("Provide at least one update option: --name, --description, --clear-description, or --allow-restricted.");
            }

            const youvico = await context.getClient();
            await youvico.files.update(options.id, updates);
            output(context.program, options, context.stdout, { ok: true });
        }));
}
