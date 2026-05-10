import { formatErrorMessage } from "./ui.js";

const NETWORK_ERROR_CODES = new Set([
    "ETIMEDOUT",
    "ECONNRESET",
    "ECONNREFUSED",
    "ENOTFOUND",
    "EAI_AGAIN"
]);

function statusFrom(error: unknown) {
    const value = error as { status?: unknown; statusCode?: unknown; response?: { status?: unknown } };
    const status = Number(value?.status ?? value?.statusCode ?? value?.response?.status);
    return Number.isFinite(status) ? status : undefined;
}

function codeFrom(error: unknown) {
    return (error as { code?: unknown })?.code;
}

export function formatError(error: unknown) {
    const status = statusFrom(error);
    if (status === 401) {
        return formatErrorMessage({
            title: "Authentication failed",
            body: apiMessageFrom(error, "The request has an invalid or missing API key."),
            hints: [
                "Run: youvico auth api",
                "Or set: YOUVICO_API_KEY"
            ]
        });
    }
    if (status === 403) {
        return formatErrorMessage({
            title: "Request forbidden",
            body: apiMessageFrom(error, "The API key is valid but has insufficient permission.")
        });
    }
    if (status !== undefined) {
        const code = codeFrom(error);
        return formatErrorMessage({
            title: "API request failed",
            body: apiMessageFrom(error, "The request failed."),
            hints: typeof code === "string" ? [`Code: ${code}`] : undefined
        });
    }

    const code = codeFrom(error);
    if (typeof code === "string" && NETWORK_ERROR_CODES.has(code)) {
        return formatNetworkError();
    }

    if (error instanceof Error && /\b(timed out|fetch failed)\b/i.test(error.message)) {
        return formatNetworkError();
    }

    if (error instanceof Error && error.message) {
        return formatErrorMessage({
            title: "Command failed",
            body: error.message
        });
    }

    return formatErrorMessage({
        title: "Command failed",
        body: "The request failed."
    });
}

function formatNetworkError() {
    return formatErrorMessage({
        title: "Network error",
        body: "The connection timed out or could not reach YouViCo.",
        hints: [
            "Check your connection",
            "Verify the configured base URL",
            "Increase timeout: youvico config set --timeout-ms 60000"
        ]
    });
}

function apiMessageFrom(error: unknown, fallback: string) {
    if (error instanceof Error && error.message) {
        return error.message;
    }

    const bodyMessage = (error as { body?: { message?: unknown } })?.body?.message;
    if (typeof bodyMessage === "string" && bodyMessage) {
        return bodyMessage;
    }

    const responseMessage = (error as { response?: { data?: { message?: unknown } } })?.response?.data?.message;
    if (typeof responseMessage === "string" && responseMessage) {
        return responseMessage;
    }

    return fallback;
}
