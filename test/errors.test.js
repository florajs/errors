'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert');

const {
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
} = require('..');

function throwError(errorClass) {
    return () => {
        throw new errorClass('an error occurred');
    };
}

describe('errors', () => {
    describe('RequestError', () => {
        it('has correct class hierarchy (for instanceof)', () => {
            assert.throws(throwError(RequestError), (err) => {
                assert(err instanceof RequestError);
                assert(err instanceof Error);
                assert.equal(err.message, 'an error occurred');
                assert(!(err instanceof ImplementationError));
                return true;
            });
        });

        it('has correct name', () => {
            assert.throws(throwError(RequestError), (err) => {
                assert.equal(err.name, 'RequestError');
                return true;
            });
        });

        it('has correct code', () => {
            assert.throws(throwError(RequestError), (err) => {
                assert.equal(err.code, 'ERR_REQUEST_ERROR');
                return true;
            });
        });

        it('has correct stack trace', () => {
            let est;

            try {
                est = new Error('msg').stack; // indent of "new" must match the "new" in next line
                throw new RequestError('msg');
            } catch (e) {
                // adjust expected stack-trace:
                est = est.split('\n');

                // set expected name of error:
                est[0] = 'Request' + est[0];

                // add 1 to expected line number (identical column number):
                est[1] = est[1].replace(/:(\d+):(\d+)\)$/g, (match, lineNumber, columnNumber) => {
                    return ':' + (parseInt(lineNumber) + 1) + ':' + columnNumber + ')';
                });

                est = est.join('\n');

                assert.equal(e.stack, est);
            }
        });
    });

    describe('AuthenticationError', () => {
        it('has correct class hierarchy (for instanceof)', () => {
            assert.throws(throwError(AuthenticationError), (err) => {
                assert(err instanceof AuthenticationError);
                assert(err instanceof Error);
                assert.equal(err.message, 'an error occurred');
                assert(!(err instanceof ImplementationError));
                return true;
            });
        });

        it('has correct code', () => {
            assert.throws(throwError(AuthenticationError), (err) => {
                assert.equal(err.code, 'ERR_AUTHENTICATION_ERROR');
                return true;
            });
        });
    });

    describe('AuthorizationError', () => {
        it('has correct class hierarchy (for instanceof)', () => {
            assert.throws(throwError(AuthorizationError), (err) => {
                assert(err instanceof AuthorizationError);
                assert(err instanceof Error);
                assert.equal(err.message, 'an error occurred');
                assert(!(err instanceof ImplementationError));
                return true;
            });
        });

        it('has correct code', () => {
            assert.throws(throwError(AuthorizationError), (err) => {
                assert.equal(err.code, 'ERR_AUTHORIZATION_ERROR');
                return true;
            });
        });
    });

    describe('NotFoundError', () => {
        it('has correct class hierarchy (for instanceof)', () => {
            assert.throws(throwError(NotFoundError), (err) => {
                assert(err instanceof NotFoundError);
                assert(err instanceof Error);
                assert.equal(err.message, 'an error occurred');
                assert(!(err instanceof ImplementationError));
                return true;
            });
        });

        it('has correct code', () => {
            assert.throws(throwError(NotFoundError), (err) => {
                assert.equal(err.code, 'ERR_NOT_FOUND');
                return true;
            });
        });
    });

    describe('GoneError', () => {
        it('has correct class hierarchy (for instanceof)', () => {
            assert.throws(throwError(GoneError), (err) => {
                assert(err instanceof GoneError);
                assert(err instanceof Error);
                assert.equal(err.message, 'an error occurred');
                assert(!(err instanceof ImplementationError));
                return true;
            });
        });

        it('has correct code', () => {
            assert.throws(throwError(GoneError), (err) => {
                assert.equal(err.code, 'ERR_GONE');
                return true;
            });
        });
    });

    describe('ImplementationError', () => {
        it('has correct class hierarchy (for instanceof)', () => {
            assert.throws(throwError(ImplementationError), (err) => {
                assert(err instanceof ImplementationError);
                assert(err instanceof Error);
                assert.equal(err.message, 'an error occurred');
                assert(!(err instanceof RequestError));
                return true;
            });
        });

        it('has correct code', () => {
            assert.throws(throwError(ImplementationError), (err) => {
                assert.equal(err.code, 'ERR_IMPLEMENTATION_ERROR');
                return true;
            });
        });
    });

    describe('DataError', () => {
        it('has correct class hierarchy (for instanceof)', () => {
            assert.throws(throwError(DataError), (err) => {
                assert(err instanceof DataError);
                assert(err instanceof Error);
                assert.equal(err.message, 'an error occurred');
                assert(!(err instanceof ImplementationError));
                return true;
            });
        });

        it('has correct code', () => {
            assert.throws(throwError(DataError), (err) => {
                assert.equal(err.code, 'ERR_DATA_ERROR');
                return true;
            });
        });
    });

    describe('ConnectionError', () => {
        it('has correct class hierarchy (for instanceof)', () => {
            assert.throws(throwError(ConnectionError), (err) => {
                assert(err instanceof ConnectionError);
                assert(err instanceof Error);
                assert.equal(err.message, 'an error occurred');
                assert(!(err instanceof ImplementationError));
                return true;
            });
        });

        it('has correct code', () => {
            assert.throws(throwError(ConnectionError), (err) => {
                assert.equal(err.code, 'ERR_CONNECTION_ERROR');
                return true;
            });
        });
    });

    describe('ValidationError', () => {
        it('has correct class hierarchy (for instanceof)', () => {
            assert.throws(throwError(ValidationError), (err) => {
                assert(err instanceof ValidationError);
                assert(err instanceof Error);
                assert.equal(err.message, 'an error occurred');
                assert(!(err instanceof ImplementationError));
                return true;
            });
        });

        it('has correct code', () => {
            assert.throws(throwError(ValidationError), (err) => {
                assert.equal(err.code, 'ERR_VALIDATION_ERROR');
                return true;
            });
        });

        it('passes through validation property', () => {
            assert.throws(
                () => {
                    throw new ValidationError('foo', 'bar');
                },
                (err) => {
                    assert(err.validation, 'bar');
                    return true;
                }
            );
        });
    });

    describe('formatting', () => {
        it('passes through error message for NotFoundError', () => {
            const error = format(new NotFoundError('foobar not found'));
            assert.equal(error.message, 'foobar not found');
        });

        it('passes through error message for GoneError', () => {
            const error = format(new GoneError('foobar was deleted'));
            assert.equal(error.message, 'foobar was deleted');
        });

        it('passes through error code for NotFoundError', () => {
            const error = format(new NotFoundError('foobar not found'));
            assert.equal(error.code, 'ERR_NOT_FOUND');
        });

        it('passes through error code for GoneError', () => {
            const error = format(new GoneError('foobar was deleted'));
            assert.equal(error.code, 'ERR_GONE');
        });

        it('hides error code for ImplementationError', () => {
            const error = format(new ImplementationError('foobar error'));
            assert.equal(error.code, undefined);
        });

        it('hides error message for ImplementationError', () => {
            const error = format(new ImplementationError('foobar error'));
            assert.equal(error.message, 'Internal Server Error');
        });

        it('never passes through stack-trace', () => {
            const error = format(new NotFoundError('foobar not found'));
            assert.equal(error.stack, undefined);
        });

        it('always passes through error code when exposeErrors = true', () => {
            const error = format(new ImplementationError('foobar error'), { exposeErrors: true });
            assert.equal(error.code, 'ERR_IMPLEMENTATION_ERROR');
        });

        it('always passes through error message when exposeErrors = true', () => {
            const error = format(new ImplementationError('foobar error'), { exposeErrors: true });
            assert.equal(error.message, 'foobar error');
        });

        it('always passes through stack-trace when exposeErrors = true', () => {
            const error = format(new NotFoundError('foobar not found'), { exposeErrors: true });
            assert(Array.isArray(error.stack));
        });

        it('merge additional information from error\'s "info" property', () => {
            const error = new ConnectionError('Cannot connect to api.example.com');

            error.info = { customProp: 'foo', message: 'bar', stack: 'foobar' };
            const formatted = format(error, { exposeErrors: true });

            assert.equal(formatted.customProp, 'foo');
            // don't overwrite standard properties
            assert.notEqual(formatted.message, 'bar');
            assert.notEqual(formatted.stack, 'foobar');
        });

        it('passes through validation property for ValidationError', () => {
            const error = format(new ValidationError('foobar error', 'META'));
            assert.equal(error.validation, 'META');
        });
    });
});
