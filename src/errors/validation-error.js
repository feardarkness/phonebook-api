'use strict';

module.exports = class ValidationError extends Error {
  constructor(error, errors) {
    super('Validation Error');
    this.errors = errors;
    this.error = error;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
};
