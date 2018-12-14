'use strict';

/* eslint no-unused-vars: 0 */
const logger = require('../../helpers/logger');
const ValidationError = require('../../errors/validation-error');
const NotFoundError = require('../../errors/not-found-error');
const UnauthorizedError = require('../../errors/unauthorized-error');

module.exports = app => {
  app.use((req, res, next) => {
    logger.info(`[${__filename}|routeNotFound] route not found middleware`, { requestedUrl: req.originalUrl });
    res.status(404).json({
      message: 'route not found',
    });
  });

  app.use((err, req, res, next) => {
    logger.error(`[${__filename}] Application error`, {
      message: err.message,
      errorStack: err.stack,
    });

    if (err instanceof ValidationError) {
      return res.status(400).json({
        message: err.error || err.message,
        errors: err.errors,
      });
    }

    if (err instanceof NotFoundError) {
      return res.status(404).json({
        message: err.error || err.message,
        errors: err.errors,
      });
    }

    if (err instanceof UnauthorizedError) {
      return res.status(401).json({
        message: err.error || err.message,
        errors: err.errors,
      });
    }

    return res.status(500).json({
      message: 'An unexpected error occurred.',
    });
  });
};
