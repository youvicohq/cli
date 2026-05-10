import type { PingWorkspace } from "@youvico/api";

export function formatAuthDetails(
    workspace: PingWorkspace,
    apiKeyPreview?: string
) {
    const lines = [`Workspace: ${workspace.name} (${workspace.id})`];
    if (apiKeyPreview) {
        lines.push(`API key: ${apiKeyPreview}`);
    }

    return lines.join("\n");
}
