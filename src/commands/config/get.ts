import type { Command } from "commander";

import { getClientConfig } from "../../lib/config.js";
import { output, run, type Writer } from "../../lib/command.js";

export function registerGetConfigCommand(
    config: Command,
    stdout: Writer,
    stderr: Writer
) {
    config
        .command("get")
        .description("Print CLI configuration")
        .action(run(stderr, async (options) => {
            const values = await getClientConfig();
            output(config.parent ?? config, options, stdout, values);
        }));
}
