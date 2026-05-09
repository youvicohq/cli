const NETWORK_ERROR_CODES = new Set([
    "ETIMEDOUT",
    "ECONNRESET",
    "ECONNREFUSED",
    "ENOTFOUND",
    "EAI_AGAIN"
]);

function statusFrom(error: unknown) {
    const value = error as { status?: unknown; statusCode?: unknown; response?: { status?: unknown } };
    return Number(value?.status ?? value?.statusCode ?? value?.response?.status);
}

function codeFrom(error: unknown) {
    return (error as { code?: unknown })?.code;
}

export function formatError(error: unknown) {
    const status = statusFrom(error);
    if (status === 401) {
        return "Authentication failed: invalid or missing API key.";
    }
    if (status === 403) {
        return "Request forbidden: API key is valid but has insufficient permission.";
    }

    const code = codeFrom(error);
    if (typeof code === "string" && NETWORK_ERROR_CODES.has(code)) {
        return "Network error: connection timed out or could not reach YouViCo.";
    }

    if (error instanceof Error && /timeout|timed out|fetch failed/i.test(error.message)) {
        return "Network error: connection timed out or could not reach YouViCo.";
    }

    if (error instanceof Error && error.message) {
        return `YouViCo error: ${error.message}`;
    }

    return "YouViCo error: request failed.";
}
