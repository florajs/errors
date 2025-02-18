export class FloraError extends Error {
    message: Readonly<string>;
    httpStatusCode: Readonly<number>;
    name: string;
}

export class RequestError extends FloraError {
    httpStatusCode: 400;
    code: string;
}

export class AuthenticationError extends FloraError {
    httpStatusCode: 401;
    code: string;
}

export class AuthorizationError extends FloraError {
    httpStatusCode: 403;
    code: string;
}

export class NotFoundError extends FloraError {
    httpStatusCode: 404;
    code: string;
}

export class GoneError extends FloraError {
    httpStatusCode: 410;
    code: string;
}

export class ImplementationError extends FloraError {
    httpStatusCode: 500;
    code: string;
}

export class DataError extends FloraError {
    httpStatusCode: 500;
    code: string;
}

export class ConnectionError extends FloraError {
    httpStatusCode: 503;
    code: string;
}

export class ValidationError extends RequestError {
    code: string;
}

/**
 * Converts an error object to a stringifyable object format for use
 * in Flora responses.
 */
export function format(err: FloraError, options: { exposeErrors: boolean }): {
    message: string,
    code?: number,
    validation: unknown,
    stack: Error['stack'],
    info: Record<string, unknown>
};
