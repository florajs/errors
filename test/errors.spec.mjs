'use strict';

import { describe, it } from 'node:test';
import assert from 'assert';
import {
    RequestError,
    AuthenticationError,
    AuthorizationError,
    NotFoundError,
    GoneError,
    ImplementationError,
    ConnectionError,
    DataError,
    ValidationError,
    format
} from '../index.mjs';

function throwError(errorClass) {
    return () => {
        throw new errorClass('an error occurred');
    };
}

describe('errors', () => {
    describe('RequestError', () => {
        it('has correct class hierarchy (for instanceof)', () => {
            assert.throws(throwError(RequestError), (error) => {
                if (!(error instanceof RequestError)) return false;
                if (!(error instanceof Error)) return false;
                if (error.message !== 'an error occurred') return false;
                if (error instanceof ImplementationError) return false;
                return true;
            });
        });

        it('has correct name', () => {
            assert.throws(
                throwError(RequestError),
                (error) => error.name === 'RequestError',
                'Error does not have the correct name'
            );
        });

        it('has correct code', () => {
            assert.throws(
                throwError(RequestError),
                (error) => error.code === 'ERR_REQUEST_ERROR',
                'Error does not have the correct code'
            );
        });

        it('has correct stack trace', () => {
            let est;
            try {
                est = new Error('msg').stack;  // indent of "new" must match the "new" in next line
                throw new RequestError('msg');
            } catch (e) {
                // Adjust expected stack:
                est = est.split('\n');

                // set expected name of error:
                est[0] = 'Request' + est[0];

                // add 1 to expected line number (identical column number):
                est[1] = est[1].replace(
                    /:(\d+):(\d+)\)$/g,
                    (match, lineNumber, columnNumber) =>
                        ':' + (parseInt(lineNumber, 10) + 1) + ':' + columnNumber + ')'
                );
                est = est.join('\n');
                assert.strictEqual(e.stack, est);
            }
        });
    });

    describe('AuthenticationError', () => {
        it('has correct class hierarchy (for instanceof)', () => {
            assert.throws(throwError(AuthenticationError), (error) => {
                if (!(error instanceof AuthenticationError)) return false;
                if (!(error instanceof Error)) return false;
                if (error.message !== 'an error occurred') return false;
                if (error instanceof ImplementationError) return false;
                return true;
            });
        });

        it('has correct code', () => {
            assert.throws(
                throwError(AuthenticationError),
                (error) => error.code === 'ERR_AUTHENTICATION_ERROR'
            );
        });
    });

    describe('AuthorizationError', () => {
        it('has correct class hierarchy (for instanceof)', () => {
            assert.throws(throwError(AuthorizationError), (error) => {
                if (!(error instanceof AuthorizationError)) return false;
                if (!(error instanceof Error)) return false;
                if (error.message !== 'an error occurred') return false;
                if (error instanceof ImplementationError) return false;
                return true;
            });
        });

        it('has correct code', () => {
            assert.throws(
                throwError(AuthorizationError),
                (error) => error.code === 'ERR_AUTHORIZATION_ERROR'
            );
        });
    });

    describe('NotFoundError', () => {
        it('has correct class hierarchy (for instanceof)', () => {
            assert.throws(throwError(NotFoundError), (error) => {
                if (!(error instanceof NotFoundError)) return false;
                if (!(error instanceof Error)) return false;
                if (error.message !== 'an error occurred') return false;
                if (error instanceof ImplementationError) return false;
                return true;
            });
        });

        it('has correct code', () => {
            assert.throws(
                throwError(NotFoundError),
                (error) => error.code === 'ERR_NOT_FOUND'
            );
        });
    });

    describe('GoneError', () => {
        it('has correct class hierarchy (for instanceof)', () => {
            assert.throws(throwError(GoneError), (error) => {
                if (!(error instanceof GoneError)) return false;
                if (!(error instanceof Error)) return false;
                if (error.message !== 'an error occurred') return false;
                if (error instanceof ImplementationError) return false;
                return true;
            });
        });

        it('has correct code', () => {
            assert.throws(
                throwError(GoneError),
                (error) => error.code === 'ERR_GONE'
            );
        });
    });

    describe('ImplementationError', () => {
        it('has correct class hierarchy (for instanceof)', () => {
            assert.throws(throwError(ImplementationError), (error) => {
                if (!(error instanceof ImplementationError)) return false;
                if (!(error instanceof Error)) return false;
                if (error.message !== 'an error occurred') return false;
                if (error instanceof RequestError) return false;
                return true;
            });
        });

        it('has correct code', () => {
            assert.throws(
                throwError(ImplementationError),
                (error) => error.code === 'ERR_IMPLEMENTATION_ERROR'
            );
        });
    });

    describe('DataError', () => {
        it('has correct class hierarchy (for instanceof)', () => {
            assert.throws(throwError(DataError), (error) => {
                if (!(error instanceof DataError)) return false;
                if (!(error instanceof Error)) return false;
                if (error.message !== 'an error occurred') return false;
                if (error instanceof ImplementationError) return false;
                return true;
            });
        });

        it('has correct code', () => {
            assert.throws(
                throwError(DataError),
                (error) => error.code === 'ERR_DATA_ERROR'
            );
        });
    });

    describe('ConnectionError', () => {
        it('has correct class hierarchy (for instanceof)', () => {
            assert.throws(throwError(ConnectionError), (error) => {
                if (!(error instanceof ConnectionError)) return false;
                if (!(error instanceof Error)) return false;
                if (error.message !== 'an error occurred') return false;
                if (error instanceof ImplementationError) return false;
                return true;
            });
        });

        it('has correct code', () => {
            assert.throws(
                throwError(ConnectionError),
                (error) => error.code === 'ERR_CONNECTION_ERROR'
            );
        });
    });

    describe('ValidationError', () => {
        it('has correct class hierarchy (for instanceof)', () => {
            assert.throws(throwError(ValidationError), (error) => {
                if (!(error instanceof ValidationError)) return false;
                if (!(error instanceof RequestError)) return false;
                if (error instanceof ImplementationError) return false;
                if (error.message !== 'an error occurred') return false;
                return true;
            });
        });

        it('has correct code', () => {
            assert.throws(
                throwError(ValidationError),
                (error) => error.code === 'ERR_VALIDATION_ERROR'
            );
        });

        it('passes through validation property', () => {
            assert.throws(
                () => {
                    throw new ValidationError('foo', 'bar');
                },
                (error) => error.validation === 'bar'
            );
        });
    });

    describe('formatting', () => {
        it('passes through error message for NotFoundError', () => {
            const error = format(new NotFoundError('foobar not found'));
            assert.strictEqual(error.message, 'foobar not found');
        });

        it('passes through error message for GoneError', () => {
            const error = format(new GoneError('foobar was deleted'));
            assert.strictEqual(error.message, 'foobar was deleted');
        });

        it('passes through error code for NotFoundError', () => {
            const error = format(new NotFoundError('foobar not found'));
            assert.strictEqual(error.code, 'ERR_NOT_FOUND');
        });

        it('passes through error code for GoneError', () => {
            const error = format(new GoneError('foobar was deleted'));
            assert.strictEqual(error.code, 'ERR_GONE');
        });

        it('hides error code for ImplementationError', () => {
            const error = format(new ImplementationError('foobar error'));
            assert.strictEqual(error.code, undefined);
        });

        it('hides error message for ImplementationError', () => {
            const error = format(new ImplementationError('foobar error'));
            assert.strictEqual(error.message, 'Internal Server Error');
        });

        it('never passes through stack-trace', () => {
            const error = format(new NotFoundError('foobar not found'));
            assert.strictEqual(error.stack, undefined);
        });

        it('always passes through error code when exposeErrors = true', () => {
            const error = format(new ImplementationError('foobar error'), { exposeErrors: true });
            assert.strictEqual(error.code, 'ERR_IMPLEMENTATION_ERROR');
        });

        it('always passes through error message when exposeErrors = true', () => {
            const error = format(new ImplementationError('foobar error'), { exposeErrors: true });
            assert.strictEqual(error.message, 'foobar error');
        });

        it('always passes through stack-trace when exposeErrors = true', () => {
            const error = format(new NotFoundError('foobar not found'), { exposeErrors: true });
            assert(
                Array.isArray(error.stack),
                'Expected stack to be an array when exposeErrors is true'
            );
        });

        it('merge additional information from error\'s "info" property', () => {
            const error = new ConnectionError('Cannot connect to api.example.com');
            error.info = { customProp: 'foo', message: 'bar', stack: 'foobar' };
            const formatted = format(error, { exposeErrors: true });
            assert.strictEqual(formatted.customProp, 'foo');
            // Standard properties should not be overwritten.
            assert.notStrictEqual(formatted.message, 'bar');
            assert.notStrictEqual(formatted.stack, 'foobar');
        });

        it('passes through validation property for ValidationError', () => {
            const error = format(new ValidationError('foobar error', 'META'));
            assert.strictEqual(error.validation, 'META');
        });
    });
});
