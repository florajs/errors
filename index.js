'use strict';

const has = require('has');

class FloraError extends Error {
    constructor(message, ...args) {
        super(message, ...args);

        this.name = this.constructor.name;

        /**
         * @type {string}
         * @name FloraError#message
         * @readonly
         */
        this.message = message;

        /**
         * @type {number}
         * @name FloraError#httpStatusCode
         * @readonly
         */
        this.httpStatusCode = 500; // HTTP status for "other errors"

        Error.captureStackTrace(this, this.constructor);
    }
}

class RequestError extends FloraError {
    constructor(...args) {
        super(...args);
        this.httpStatusCode = 400;
        this.code = 'ERR_REQUEST_ERROR';
    }
}

class AuthenticationError extends FloraError {
    constructor(...args) {
        super(...args);
        this.httpStatusCode = 401;
        this.code = 'ERR_AUTHENTICATION_ERROR';
    }
}

class AuthorizationError extends FloraError {
    constructor(...args) {
        super(...args);
        this.httpStatusCode = 403;
        this.code = 'ERR_AUTHORIZATION_ERROR';
    }
}

class NotFoundError extends FloraError {
    constructor(...args) {
        super(...args);
        this.httpStatusCode = 404;
        this.code = 'ERR_NOT_FOUND';
    }
}

class ImplementationError extends FloraError {
    constructor(...args) {
        super(...args);
        this.httpStatusCode = 500;
        this.code = 'ERR_IMPLEMENTATION_ERROR';
    }
}

class DataError extends FloraError {
    constructor(...args) {
        super(...args);
        this.httpStatusCode = 500;
        this.code = 'ERR_DATA_ERROR';
    }
}

class ConnectionError extends FloraError {
    constructor(...args) {
        super(...args);
        this.httpStatusCode = 503;
        this.code = 'ERR_CONNECTION_ERROR';
    }
}

/**
 * Converts an error object to a stringifyable object format for use
 * in Flora responses.
 *
 * @param {FloraError} err object
 * @param {Object=} options
 */
function format(err, options) {
    const error = { message: 'Internal Server Error' };

    options = options || {};

    if (err.httpStatusCode && err.httpStatusCode < 500) error.message = err.message;

    if (err.code) error.code = err.code;

    if (options.exposeErrors) {
        error.message = err.message;
        error.stack = err.stack.split(/\r?\n/);

        if (err.info) {
            Object.keys(err.info).forEach((key) => {
                if (!has(error, key)
                    && has(err.info, key)) error[key] = err.info[key];
            });
        }
    }

    return error;
}

module.exports = {
    RequestError,
    AuthenticationError,
    AuthorizationError,
    NotFoundError,
    ImplementationError,
    DataError,
    ConnectionError,
    FloraError,
    format
};
