type Message = {
    title: string;
    body?: string;
    hints?: string[];
};

const icons = {
    success: "✅",
    warning: "⚠️ ",
    error: "❌",
    cancelled: "↩️ "
};

function supportsColor() {
    return process.env.NO_COLOR === undefined &&
        process.env.TERM !== "dumb" &&
        Boolean(process.stderr.isTTY || process.stdout.isTTY);
}

function color(code: number, value: string) {
    if (!supportsColor()) {
        return value;
    }

    return `\u001B[${code}m${value}\u001B[0m`;
}

function linesFor(message: Message, icon: string, colorCode: number) {
    const lines = [color(colorCode, `${icon} ${message.title}`)];

    if (message.body) {
        lines.push("", message.body);
    }

    if (message.hints && message.hints.length > 0) {
        lines.push("", ...message.hints.map(hint => `• ${hint}`));
    }

    return lines.join("\n");
}

export function formatSuccess(title: string, body?: string) {
    return linesFor({ title, body }, icons.success, 32);
}

export function formatWarning(title: string, hints?: string[]) {
    return linesFor({ title, hints }, icons.warning, 33);
}

export function formatErrorMessage(message: Message) {
    return linesFor(message, icons.error, 31);
}

export function formatCancelled(title: string) {
    return `${icons.cancelled} ${title}. No changes were made.`;
}
