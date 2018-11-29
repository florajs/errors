# Flora Errors

[![Build Status](https://travis-ci.org/godmodelabs/flora-errors.svg?branch=master)](https://travis-ci.org/godmodelabs/flora-errors)
[![NPM version](https://badge.fury.io/js/flora-errors.svg)](https://www.npmjs.com/package/flora-errors)
[![Dependencies](https://img.shields.io/david/godmodelabs/flora-errors.svg)](https://david-dm.org/godmodelabs/flora-errors)

Error definitions for [Flora](https://github.com/godmodelabs/flora).

This module exposes error classes for different types of errors to be able to determine whether an error should be displayed to the client (such as AuthenticationError) or not (internal errors).

To be able to pass through the error type to clients, a `code` property is also set. The default error codes are listed below.

## Error classes

### RequestError

Generic request error (the user made an invalid request). HTTP status code `400`, the `message` will be displayed.
Error code is `ERR_REQUEST_ERROR`.

### AuthenticationError

The user is either not authenticated, or the credentials are wrong. HTTP status code `401`.
Error code is `ERR_AUTHENTICATION_ERROR`.

### AuthorizationError

The user may be authenticated, but is not authorized for the requested action. HTTP status code `403`.
Error code is `ERR_AUTHORIZATION_ERROR`.

### NotFoundError

Either the requested resource could not be found, or a specific entity of the resource. HTTP status code `404`, `message` will be displayed.
Error code is `ERR_NOT_FOUND`.

### ImplementationError

There is a problem with the implementation, e.g. of one of the resources. This should not happen. HTTP status code `500`.
Error code is `ERR_IMPLEMENTATION_ERROR`.

### DataError

There is a problem with the data retrieved by one of the data sources. HTTP status code `500`.
Error code is `ERR_DATA_ERROR`.

### ConnectionError

There is a problem with the connection to a data source. May work on retry (e.g. temporary network problems). HTTP status code `503`.
Error code is `ERR_CONNECTION_ERROR`.

### ValidationError

There is a problem validating input data. This is a special case of `RequestError`. HTTP status code `400`.
Error code is `ERR_VALIDATION_ERROR`. Second parameter of constructor will be added as additional `validation` property.

## License

[MIT](LICENSE)
