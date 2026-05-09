import type { Command } from "commander";

import type { createClient } from "./client.js";
import { formatError } from "./errors.js";
import { writeResult } from "./output.js";

export type Writer = (message: string) => void;
export type YouvicoClient = Awaited<ReturnType<typeof createClient>>;
export type GetClient = () => Promise<YouvicoClient>;
export type CommandContext = {
    program: Command;
    stdout: Writer;
    stderr: Writer;
    getClient: GetClient;
};

export function run<TOptions>(
    stderr: Writer,
    action: (options: TOptions) => Promise<void>
) {
    return async (options: TOptions) => {
        try {
            await action(options);
        }
        catch (error) {
            stderr(formatError(error));
            process.exitCode = 1;
        }
    };
}

export function output(
    _program: Command,
    _options: unknown,
    stdout: Writer,
    value: unknown
) {
    writeResult(value, {
        stdout
    });
}
