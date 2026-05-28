import type { Command } from "commander";

import { registerCreateSkillCommand } from "./skill/create.js";
import { registerDeleteSkillCommand } from "./skill/delete.js";
import { registerGetSkillCommand } from "./skill/get.js";
import { registerListSkillsCommand } from "./skill/list.js";
import { registerUpdateSkillCommand } from "./skill/update.js";
import type { CommandContext } from "../lib/command.js";

export function registerSkillCommands(
    program: Command,
    stdout: CommandContext["stdout"],
    stderr: CommandContext["stderr"],
    getClient: CommandContext["getClient"]
) {
    const skill = program
        .command("skill")
        .description("Work with skills");

    const context = { program, stdout, stderr, getClient };

    skill.action(() => skill.outputHelp());
    registerListSkillsCommand(skill, context);
    registerGetSkillCommand(skill, context);
    registerCreateSkillCommand(skill, context);
    registerUpdateSkillCommand(skill, context);
    registerDeleteSkillCommand(skill, context);
}
