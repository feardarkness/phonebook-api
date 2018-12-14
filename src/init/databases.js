'use strict';

const mongoose = require('mongoose');
const logger = require('../helpers/logger');
const models = require('../models');
const boot = require('./boot');
const { db: dbConfig } = require('../configurations');

logger.info(`[${__filename}] *** Connecting to database and creating routes ***`);
const connection = mongoose.createConnection(`mongodb://${dbConfig.ip}:${dbConfig.port}/${dbConfig.name}`, {
  useNewUrlParser: true,
});
mongoose.Promise = Promise;

mongoose.set('useCreateIndex', true);
// mongoose.set('debug', true);

connection.on('connected', () => {
  logger.info(`[${__filename}] *** Connected to DB ***`);
  boot.startApp();
});

connection.on('error', err => {
  logger.error(`[${__filename}] *** Error connecting to DB ***`, {
    errorMessage: err.message,
    errorStack: err.stack,
  });
});

const closeConn = () => {
  try {
    connection.close(() => {
      logger.info(`[${__filename}] *** Connection to DB closed ***`);
      process.exit(0);
    });
  } catch (err) {
    logger.error(`[${__filename}] `, {
      message: err.message,
      stackTrace: err.trace,
    });
    process.exit(1);
  }
};

process.on('SIGINT', closeConn).on('SIGTERM', closeConn);

Object.keys(models).forEach(model => {
  logger.info(`[${__filename}] *** Adding model -${models[model].name}- ***`);
  connection.model(models[model].name, models[model].esquema);
});

module.exports = connection;
