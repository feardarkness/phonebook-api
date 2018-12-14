'use strict';

module.exports = {
  baseUrl: process.env.BASE_URL || '',
  port: process.env.APP_PORT || 8080,
  token: {
    secret: process.env.SECRET || 'token-secret-gen', // length 16
    time: 30,
    unit: 'm', // minutes, but could be in hours(h) too
    algorithm: 'HS256',
  },
};
