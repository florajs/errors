'use strict';

const { expect } = require('chai');
const {
    RequestError,
    AuthenticationError,
    AuthorizationError,
    NotFoundError,
    ImplementationError,
    ConnectionError,
    DataError,
    format
} = require('..');

function throwError(errorClass) {
    return () => {
        throw new errorClass('an error occurred');
    };
}

describe('flora-errors', () => {
    describe('RequestError', () => {
        it('has correct class hierarchy (for instanceof)', () => {
            try {
                throw new RequestError('an error occurred');
            } catch (e) {
                expect(e).to.be.an.instanceof(RequestError);
                expect(e).to.not.be.an.instanceof(ImplementationError);
                expect(e).to.be.an.instanceof(Error);
            }
        });

        it('has correct name', () => {
            try {
                throw new RequestError('an error occurred');
            } catch (e) {
                expect(e.name).to.equal('RequestError');
            }
        });

        it('has correct code', () => {
            try {
                throw new RequestError('an error occurred');
            } catch (e) {
                expect(e.code).to.equal('ERR_REQUEST_ERROR');
            }
        });

        it('passes through message', () => {
            try {
                throw new RequestError('an error occurred');
            } catch (e) {
                expect(e.message).to.equal('an error occurred');
            }
        });

        it('has correct stack trace', () => {
            let expectedStackTrace;

            try {
                expectedStackTrace =
                      new Error('msg').stack; // indent of "new" must match the "new" in next line
                throw new RequestError('msg');
            } catch (e) {
                // adjust expected stack-trace:
                expectedStackTrace = expectedStackTrace.split('\n');

                // set expected name of error:
                expectedStackTrace[0] = 'Request' + expectedStackTrace[0];

                // add 1 to expected line number (identical column number):
                expectedStackTrace[1] = expectedStackTrace[1].replace(/:(\d+):(\d+)\)$/g, (match, lineNumber, columnNumber) => {
                    return ':' + (parseInt(lineNumber) + 1) + ':' + columnNumber + ')';
                });

                expectedStackTrace = expectedStackTrace.join('\n');

                expect(e.stack).to.equal(expectedStackTrace);
            }
        });
    });

    describe('AuthenticationError', () => {
        it('has correct class hierarchy (for instanceof)', () => {
            try {
                throw new AuthenticationError('an error occurred');
            } catch (e) {
                expect(e).to.be.an.instanceof(AuthenticationError);
                expect(e).to.not.be.an.instanceof(ImplementationError);
                expect(e).to.be.an.instanceof(Error);
            }
        });

        it('has correct code', () => {
            try {
                throw new AuthenticationError('an error occurred');
            } catch (e) {
                expect(e.code).to.equal('ERR_AUTHENTICATION_ERROR');
            }
        });
    });

    describe('AuthorizationError', () => {
        it('has correct class hierarchy (for instanceof)', () => {
            try {
                throw new AuthorizationError('an error occurred');
            } catch (e) {
                expect(e).to.be.an.instanceof(AuthorizationError);
                expect(e).to.not.be.an.instanceof(ImplementationError);
                expect(e).to.be.an.instanceof(Error);
            }
        });

        it('has correct code', () => {
            try {
                throw new AuthorizationError('an error occurred');
            } catch (e) {
                expect(e.code).to.equal('ERR_AUTHORIZATION_ERROR');
            }
        });
    });

    describe('NotFoundError', () => {
        it('has correct class hierarchy (for instanceof)', () => {
            try {
                throw new NotFoundError('an error occurred');
            } catch (e) {
                expect(e).to.be.an.instanceof(NotFoundError);
                expect(e).to.not.be.an.instanceof(ImplementationError);
                expect(e).to.be.an.instanceof(Error);
            }
        });

        it('has correct code', () => {
            try {
                throw new NotFoundError('an error occurred');
            } catch (e) {
                expect(e.code).to.equal('ERR_NOT_FOUND');
            }
        });
    });

    describe('ImplementationError', () => {
        it('has correct class hierarchy (for instanceof)', () => {
            try {
                throw new ImplementationError('an error occurred');
            } catch (e) {
                expect(e).to.be.an.instanceof(ImplementationError);
                expect(e).to.not.be.an.instanceof(RequestError);
                expect(e).to.be.an.instanceof(Error);
            }
        });

        it('has correct code', () => {
            try {
                throw new ImplementationError('an error occurred');
            } catch (e) {
                expect(e.code).to.equal('ERR_IMPLEMENTATION_ERROR');
            }
        });
    });

    describe('DataError', () => {
        it('has correct class hierarchy (for instanceof)', () => {
            try {
                throw new DataError('an error occurred');
            } catch (e) {
                expect(e).to.be.an.instanceof(DataError);
                expect(e).to.not.be.an.instanceof(ImplementationError);
                expect(e).to.be.an.instanceof(Error);
            }
        });

        it('has correct code', () => {
            try {
                throw new DataError('an error occurred');
            } catch (e) {
                expect(e.code).to.equal('ERR_DATA_ERROR');
            }
        });
    });

    describe('ConnectionError', () => {
        it('has correct class hierarchy (for instanceof)', () => {
            try {
                throw new ConnectionError('an error occurred');
            } catch (e) {
                expect(e).to.be.an.instanceof(ConnectionError);
                expect(e).to.not.be.an.instanceof(ImplementationError);
                expect(e).to.be.an.instanceof(Error);
            }
        });

        it('has correct code', () => {
            try {
                throw new ConnectionError('an error occurred');
            } catch (e) {
                expect(e.code).to.equal('ERR_CONNECTION_ERROR');
            }
        });
    });

    describe('formatting', () => {
        it('passes through error message for NotFoundError', () => {
            const error = format(new NotFoundError('foobar not found'));
            expect(error.message).to.equal('foobar not found');
        });

        it('passes through error code', () => {
            const error = format(new NotFoundError('foobar not found'));
            expect(error.code).to.equal('ERR_NOT_FOUND');
        });

        it('hides error message for ImplementationError', () => {
            const error = format(new ImplementationError('foobar error'));
            expect(error.message).to.equal('Internal Server Error');
        });

        it('never passes through stack-trace', () => {
            const error = format(new NotFoundError('foobar not found'));
            expect(error.stack).to.be.undefined;
        });

        it('always passes through error message when exposeErrors = true', () => {
            const error = format(new ImplementationError('foobar error'), {exposeErrors: true});
            expect(error.message).to.equal('foobar error');
        });

        it('always passes through stack-trace when exposeErrors = true', () => {
            const error = format(new NotFoundError('foobar not found'), {exposeErrors: true});
            expect(error.stack).to.be.an('array');
        });

        it('merge additional information from error\'s "info" property', () => {
            const error = new ConnectionError('Cannot connect to api.example.com');

            error.info = {customProp: 'foo', message: 'bar', stack: 'foobar'};
            const formatted = format(error, {exposeErrors: true});

            expect(formatted.customProp).to.equal('foo');
            // don't overwrite standard properties
            expect(formatted.message).not.to.equal('bar');
            expect(formatted.stack).not.to.equal('foobar');
        });
    });
});
