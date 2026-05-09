import type { Command } from "commander";

import { clearClientConfig } from "../../lib/config.js";
import { run, type Writer } from "../../lib/command.js";

export function registerClearConfigCommand(
    config: Command,
    stdout: Writer,
    stderr: Writer
) {
    config
        .command("clear")
        .description("Clear CLI configuration")
        .option("--base-url", "clear saved base URL")
        .option("--timeout-ms", "clear saved timeout")
        .action(run(stderr, async (options) => {
            const keys = [
                options.baseUrl ? "baseUrl" : undefined,
                options.timeoutMs ? "timeoutMs" : undefined
            ].filter(Boolean) as Array<"baseUrl" | "timeoutMs">;

            await clearClientConfig(keys.length > 0 ? keys : ["baseUrl", "timeoutMs"]);
            stdout("Config cleared.");
        }));
}
