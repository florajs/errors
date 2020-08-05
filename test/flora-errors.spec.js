/* global describe, it */

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
    ValidationError,
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
            expect(throwError(RequestError))
                .to.throw(RequestError, 'an error occurred')
                .and.to.be.instanceOf(Error)
                .and.not.to.be.instanceOf(ImplementationError);
        });

        it('has correct name', () => {
            expect(throwError(RequestError)).to.throw().and.to.have.property('name', 'RequestError');
        });

        it('has correct code', () => {
            expect(throwError(RequestError)).to.throw().and.to.have.property('code', 'ERR_REQUEST_ERROR');
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

                expect(e.stack).to.equal(est);
            }
        });
    });

    describe('AuthenticationError', () => {
        it('has correct class hierarchy (for instanceof)', () => {
            expect(throwError(AuthenticationError))
                .to.throw(AuthenticationError, 'an error occurred')
                .and.to.be.instanceOf(Error)
                .and.not.to.be.instanceOf(ImplementationError);
        });

        it('has correct code', () => {
            expect(throwError(AuthenticationError)).to.throw().and.to.have.property('code', 'ERR_AUTHENTICATION_ERROR');
        });
    });

    describe('AuthorizationError', () => {
        it('has correct class hierarchy (for instanceof)', () => {
            expect(throwError(AuthorizationError))
                .to.throw(AuthorizationError, 'an error occurred')
                .and.to.be.instanceOf(Error)
                .and.not.to.be.instanceOf(ImplementationError);
        });

        it('has correct code', () => {
            expect(throwError(AuthorizationError)).to.throw().and.to.have.property('code', 'ERR_AUTHORIZATION_ERROR');
        });
    });

    describe('NotFoundError', () => {
        it('has correct class hierarchy (for instanceof)', () => {
            expect(throwError(NotFoundError))
                .to.throw(NotFoundError, 'an error occurred')
                .and.to.be.instanceOf(Error)
                .and.not.to.be.instanceOf(ImplementationError);
        });

        it('has correct code', () => {
            expect(throwError(NotFoundError)).to.throw().and.to.have.property('code', 'ERR_NOT_FOUND');
        });
    });

    describe('ImplementationError', () => {
        it('has correct class hierarchy (for instanceof)', () => {
            expect(throwError(ImplementationError))
                .to.throw(ImplementationError, 'an error occurred')
                .and.to.be.instanceOf(Error)
                .and.not.to.be.instanceOf(RequestError);
        });

        it('has correct code', () => {
            expect(throwError(ImplementationError)).to.throw().and.to.have.property('code', 'ERR_IMPLEMENTATION_ERROR');
        });
    });

    describe('DataError', () => {
        it('has correct class hierarchy (for instanceof)', () => {
            expect(throwError(DataError))
                .to.throw(DataError, 'an error occurred')
                .and.to.be.instanceOf(Error)
                .and.not.to.be.instanceOf(ImplementationError);
        });

        it('has correct code', () => {
            expect(throwError(DataError)).to.throw().and.to.have.property('code', 'ERR_DATA_ERROR');
        });
    });

    describe('ConnectionError', () => {
        it('has correct class hierarchy (for instanceof)', () => {
            expect(throwError(ConnectionError))
                .to.throw(ConnectionError, 'an error occurred')
                .and.to.be.instanceOf(Error)
                .and.not.to.be.instanceOf(ImplementationError);
        });

        it('has correct code', () => {
            expect(throwError(ConnectionError)).to.throw().and.to.have.property('code', 'ERR_CONNECTION_ERROR');
        });
    });

    describe('ValidationError', () => {
        it('has correct class hierarchy (for instanceof)', () => {
            expect(throwError(ValidationError))
                .to.throw(ValidationError, 'an error occurred')
                .and.to.be.instanceOf(RequestError)
                .and.not.to.be.instanceOf(ImplementationError);
        });

        it('has correct code', () => {
            expect(throwError(ValidationError)).to.throw().and.to.have.property('code', 'ERR_VALIDATION_ERROR');
        });

        it('passes through validation property', () => {
            expect(() => {
                throw new ValidationError('foo', 'bar');
            })
                .to.throw()
                .and.to.have.property('validation', 'bar');
        });
    });

    describe('formatting', () => {
        it('passes through error message for NotFoundError', () => {
            const error = format(new NotFoundError('foobar not found'));
            expect(error.message).to.equal('foobar not found');
        });

        it('passes through error code for NotFoundError', () => {
            const error = format(new NotFoundError('foobar not found'));
            expect(error.code).to.equal('ERR_NOT_FOUND');
        });

        it('hides error code for ImplementationError', () => {
            const error = format(new ImplementationError('foobar error'));
            expect(error.code).to.be.undefined;
        });

        it('hides error message for ImplementationError', () => {
            const error = format(new ImplementationError('foobar error'));
            expect(error.message).to.equal('Internal Server Error');
        });

        it('never passes through stack-trace', () => {
            const error = format(new NotFoundError('foobar not found'));
            expect(error.stack).to.be.undefined;
        });

        it('always passes through error code when exposeErrors = true', () => {
            const error = format(new ImplementationError('foobar error'), { exposeErrors: true });
            expect(error.code).to.equal('ERR_IMPLEMENTATION_ERROR');
        });

        it('always passes through error message when exposeErrors = true', () => {
            const error = format(new ImplementationError('foobar error'), { exposeErrors: true });
            expect(error.message).to.equal('foobar error');
        });

        it('always passes through stack-trace when exposeErrors = true', () => {
            const error = format(new NotFoundError('foobar not found'), { exposeErrors: true });
            expect(error.stack).to.be.an('array');
        });

        it('merge additional information from error\'s "info" property', () => {
            const error = new ConnectionError('Cannot connect to api.example.com');

            error.info = { customProp: 'foo', message: 'bar', stack: 'foobar' };
            const formatted = format(error, { exposeErrors: true });

            expect(formatted.customProp).to.equal('foo');
            // don't overwrite standard properties
            expect(formatted.message).not.to.equal('bar');
            expect(formatted.stack).not.to.equal('foobar');
        });

        it('passes through validation property for ValidationError', () => {
            const error = format(new ValidationError('foobar error', 'META'));
            expect(error.validation).to.equal('META');
        });
    });
});
