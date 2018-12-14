'use strict';

const coreSchema = require('../../core/schemas/index');

module.exports.post = {
  firstName: {
    type: 'string',
    empty: false,
    min: 5,
    max: 50,
  },
  lastName: {
    type: 'string',
    empty: false,
    min: 5,
    max: 50,
    optional: true,
  },
  company: {
    type: 'string',
    empty: false,
    min: 5,
    max: 50,
    optional: true,
  },
  userId: {
    type: 'string',
    empty: false,
    min: 24,
    max: 24,
    optional: true,
  },
  phoneNumbers: {
    type: 'array',
    items: {
      type: 'object',
      min: 1,
      max: 10,
      props: {
        type: {
          type: 'string',
          empty: false,
          min: 2,
          max: 50,
        },
        number: {
          type: 'string',
          empty: false,
          min: 6,
          max: 50,
        },
      },
    },
  },
};

module.exports.get = {
  ...coreSchema.pagination.get,
};
