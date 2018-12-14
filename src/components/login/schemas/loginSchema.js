'use strict';

module.exports.post = {
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
};
