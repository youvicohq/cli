import type { ProjectRole } from "@youvico/api";
import { InvalidArgumentError } from "commander";

export const projectAccessRanges = [
    "ONLY_PROJECT_MEMBER",
    "ALLOW_WORKSPACE_MEMBER"
] as const;

const projectRoles = new Set<ProjectRole>([
    "PROJECT_MANAGER",
    "PROJECT_MEMBER",
    "PROJECT_REVIEWER",
    "PROJECT_RESTRICTED_REVIEWER"
]);

export function collectProjectMember(
    value: string,
    previous: Array<{ user: { id: string }; role: ProjectRole }> | undefined
) {
    const [userId, role, extra] = value.split(":");

    if (!userId || !role || extra !== undefined || !projectRoles.has(role as ProjectRole)) {
        throw new InvalidArgumentError("must be userId:PROJECT_MANAGER|PROJECT_MEMBER|PROJECT_REVIEWER|PROJECT_RESTRICTED_REVIEWER");
    }

    return [
        ...previous ?? [],
        {
            user: {
                id: userId
            },
            role: role as ProjectRole
        }
    ];
}
