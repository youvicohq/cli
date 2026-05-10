import { InvalidArgumentError, Option, type Command } from "commander";

import { setClientConfig } from "../../lib/config.js";
import { run, type Writer } from "../../lib/command.js";
import { formatSuccess } from "../../lib/ui.js";

export function registerSetConfigCommand(
    config: Command,
    stdout: Writer,
    stderr: Writer
) {
    config
        .command("set")
        .description("Set CLI configuration")
        .option("--base-url <url>", "YouViCo API base URL")
        .addOption(new Option("--timeout-ms <timeoutMs>", "request timeout in milliseconds").argParser(parsePositiveInteger))
        .action(run(stderr, async (options) => {
            const values = {
                baseUrl: options.baseUrl as string | undefined,
                timeoutMs: options.timeoutMs as number | undefined
            };

            if (values.baseUrl === undefined && values.timeoutMs === undefined) {
                throw new Error("Provide at least one config option: --base-url or --timeout-ms.");
            }

            await setClientConfig(values);
            stdout(formatSuccess("Config saved"));
        }));
}

function parsePositiveInteger(value: string) {
    const parsed = Number(value);
    if (!Number.isInteger(parsed) || parsed <= 0) {
        throw new InvalidArgumentError("must be a positive integer");
    }
    return parsed;
}
