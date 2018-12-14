'use strict';

const rp = require('request-promise');
const { weatherService: weatherServiceConfig } = require('../configurations');

module.exports.getWeatherConditions = params => {
  const options = {
    uri: `${weatherServiceConfig.baseUrl}weather`,
    qs: {
      lat: params.latitude,
      lon: params.longitude,
      APPID: weatherServiceConfig.key,
    },
    method: 'GET',
    json: true,
  };
  return rp(options);
};
