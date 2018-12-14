'use strict';

const express = require('express');
const events = require('events');
const routes = require('./routes');
const logger = require('../helpers/logger');
const middlewaresBefore = require('./middlewares/before');
const middlewaresAfter = require('./middlewares/after');

const app = express();
app.globalEventEmitter = new events.EventEmitter();

logger.info(`[${__filename}] *** Setting middlewares before routes ***`);
middlewaresBefore(app);

logger.info(`[${__filename}] *** Setting up routes ***`);
routes.init(app);

logger.info(`[${__filename}] *** Setting middlewares after routes ***`);
middlewaresAfter(app);

module.exports = app;
