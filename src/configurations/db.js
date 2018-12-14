'use strict';

module.exports = {
  ip: process.env.DB_IP_ADDRESS || '127.0.0.1',
  port: process.env.DB_PORT || 27017,
  name: process.env.DB_NAME || 'dbname',
};
