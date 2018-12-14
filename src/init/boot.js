'use strict';

require('./databases');
const EventEmitter = require('events');
const logger = require('../helpers/logger');
const configs = require('../configurations');
const app = require('./index');

app.startupEmitter = new EventEmitter();

module.exports.startApp = () => {
  app.listen(configs.app.port, () => {
    logger.info(`[${__filename}|listen] *** App started, port ${configs.app.port} ***`);
    app.startupEmitter.emit('ready');
  });
};

module.exports.start = () => {
  logger.info(`[${__filename}|iniciar] *** Loading app ***`);
  return app;
};
