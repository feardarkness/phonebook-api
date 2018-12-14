'use strict';

const db = require('../../init/databases');
const userStatesEnum = require('../../enums/user-states');

const { Users } = db.models;

/**
 * Find one active user
 * @param {string} username
 */
module.exports.findActiveUser = username => {
  return Users.findOne(
    {
      username,
      state: userStatesEnum.CREATED,
    },
    '-__v',
  ).exec();
};
