import type { Command } from "commander";

import { registerDeleteSkillVersionCommand } from "./skill-version/delete.js";
import { registerGetSkillVersionCommand } from "./skill-version/get.js";
import { registerPublishSkillVersionCommand } from "./skill-version/publish.js";
import type { CommandContext } from "../lib/command.js";

export function registerSkillVersionCommands(
    program: Command,
    stdout: CommandContext["stdout"],
    stderr: CommandContext["stderr"],
    getClient: CommandContext["getClient"]
) {
    const skillVersion = program
        .command("skill-version")
        .description("Work with skill versions");

    const context = { program, stdout, stderr, getClient };

    skillVersion.action(() => skillVersion.outputHelp());
    registerPublishSkillVersionCommand(skillVersion, context);
    registerGetSkillVersionCommand(skillVersion, context);
    registerDeleteSkillVersionCommand(skillVersion, context);
}
