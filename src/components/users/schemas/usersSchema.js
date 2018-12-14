'use strict';

const coreSchema = require('../../core/schemas/index');

module.exports.postRegular = {
  username: {
    type: 'string',
    empty: false,
    min: 5,
    max: 50,
  },
  password: {
    type: 'string',
    empty: false,
    min: 5,
    max: 100,
  },
  email: {
    type: 'email',
    empty: false,
    max: 50,
  },
};

module.exports.patch = {
  password: {
    type: 'string',
    empty: false,
    min: 5,
    max: 100,
    optional: true,
  },
  email: {
    type: 'email',
    empty: false,
    max: 50,
    optional: true,
  },
};

module.exports.get = {
  ...coreSchema.pagination.get,
};
