import { InvalidArgumentError, Option, type Command } from "commander";

import { output, run, type CommandContext } from "../../lib/command.js";

export function registerSearchProjectsCommand(
    project: Command,
    context: CommandContext
) {
    project
        .command("search")
        .description("Search projects")
        .requiredOption("--query <query>", "search query")
        .addOption(new Option("--page <page>", "page number").argParser(parsePositiveInteger))
        .addOption(new Option("--sort <sort>", "sort field").choices(["name", "createdAt"]))
        .addOption(new Option("--direction <direction>", "sort direction").choices(["asc", "desc"]))
        .action(run(context.stderr, async (options) => {
            const youvico = await context.getClient();
            const result = await youvico.projects.search({
                query: options.query,
                page: options.page,
                sort: options.sort
                    ? {
                            type: options.sort,
                            direction: options.direction
                        }
                    : undefined
            });
            output(context.program, options, context.stdout, result);
        }));
}

function parsePositiveInteger(value: string) {
    const parsed = Number(value);
    if (!Number.isInteger(parsed) || parsed <= 0) {
        throw new InvalidArgumentError("must be a positive integer");
    }
    return parsed;
}
