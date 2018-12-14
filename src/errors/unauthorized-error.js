'use strict';

module.exports = class UnauthorizedError extends Error {
  constructor(error, errors) {
    super('Unauthorized Error');
    this.errors = errors;
    this.error = error;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
};
