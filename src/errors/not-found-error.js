'use strict';

module.exports = class NotFoundError extends Error {
  constructor(error, errors) {
    super('Not Found Error');
    this.errors = errors;
    this.error = error;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
};
