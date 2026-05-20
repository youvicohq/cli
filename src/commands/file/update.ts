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
        .option("--folder <folder>", "move file to folder ID")
        .option("--clear-folder", "remove file from its folder")
        .action(run(context.stderr, async (options) => {
            if (options.description !== undefined && options.clearDescription) {
                throw new Error("Use either --description or --clear-description, not both.");
            }
            if (options.folder !== undefined && options.clearFolder) {
                throw new Error("Use either --folder or --clear-folder, not both.");
            }

            const updates: {
                name?: string;
                description?: string | null;
                allowRestricted?: boolean;
                folder?: {
                    id: string;
                } | null;
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
            if (options.clearFolder) {
                updates.folder = null;
            }
            else if (options.folder !== undefined) {
                updates.folder = {
                    id: options.folder
                };
            }

            if (Object.keys(updates).length === 0) {
                throw new Error("Provide at least one update option: --name, --description, --clear-description, --allow-restricted, --folder, or --clear-folder.");
            }

            const youvico = await context.getClient();
            await youvico.files.update(options.id, updates);
            output(context.program, options, context.stdout, { ok: true });
        }));
}
