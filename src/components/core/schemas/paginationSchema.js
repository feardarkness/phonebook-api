'use strict';

module.exports.get = {
  page: {
    type: 'number',
    integer: true,
    min: 1,
    convert: true,
  },
  limit: {
    type: 'number',
    integer: true,
    min: 1,
    max: 50,
    convert: true,
  },
  filter: {
    type: 'string',
    empty: true,
    optional: true,
  },
};
