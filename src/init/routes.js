'use strict';

const allRoutes = require('../components');
const logger = require('../helpers/logger');

module.exports.init = app => {
  Object.keys(allRoutes).forEach(routeName => {
    logger.info(`[${__filename}] *** Adding route -${routeName}- ***`);
    app.use(`/${routeName}`, allRoutes[routeName]);
  });
};
