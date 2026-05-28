import { InvalidArgumentError } from "commander";

export function collectAllowedTool(value: string, previous: string[] | undefined) {
    return [...previous ?? [], value];
}

export function parseMetadata(value: string) {
    let parsed: unknown;

    try {
        parsed = JSON.parse(value);
    }
    catch {
        throw new InvalidArgumentError("must be a JSON object with string values");
    }

    if (
        parsed === null ||
        Array.isArray(parsed) ||
        typeof parsed !== "object" ||
        Object.values(parsed).some(item => typeof item !== "string")
    ) {
        throw new InvalidArgumentError("must be a JSON object with string values");
    }

    return parsed as Record<string, string>;
}
