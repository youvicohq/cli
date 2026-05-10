import { confirm } from "@inquirer/prompts";

type ConfirmDestructiveOptions = {
    action: string;
    target: string;
};

export function confirmDestructive(options: ConfirmDestructiveOptions) {
    return confirm({
        message: [
            `⚠️  ${options.action} ${options.target}?`,
            "",
            "This cannot be undone.",
            "Use --yes to skip this prompt in scripts."
        ].join("\n"),
        default: false
    });
}
