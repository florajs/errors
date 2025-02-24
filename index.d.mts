export class FloraError<ErrorCode extends number = 500> extends Error {
    message: Readonly<string>;
    httpStatusCode: ErrorCode;
    name: string;
}

export class RequestError extends FloraError<400> {
    code: string;
}

export class AuthenticationError extends FloraError<401> {
    code: string;
}

export class AuthorizationError extends FloraError<403> {
    code: string;
}

export class NotFoundError extends FloraError<404> {
    code: string;
}

export class GoneError extends FloraError<410> {
    code: string;
}

export class ImplementationError extends FloraError<500> {
    code: string;
}

export class DataError extends FloraError<500> {
    code: string;
}

export class ConnectionError extends FloraError<503> {
    code: string;
}

export class ValidationError extends RequestError {
    code: string;
}

/**
 * Converts an error object to a stringifyable object format for use
 * in Flora responses.
 */
export function format(
    err: FloraError,
    options: { exposeErrors: boolean }
): {
    message: string;
    code?: number;
    validation: unknown;
    stack: Error['stack'];
    info: Record<string, unknown>;
};
