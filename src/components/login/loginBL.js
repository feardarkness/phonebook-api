'use strict';

const bcrypt = require('bcrypt');
const jwt = require('jwt-simple');
const moment = require('moment');
const Validator = require('fastest-validator');
const schemas = require('./schemas');
const conf = require('../../configurations/app');
const loginDAO = require('./loginDAO');

/**
 * Validate params
 * @param  {Object} params
 * @param  {Object} params.username
 * @param  {Object} params.password
 * @returns {Array|Boolean} List of errors if something is invalid; true if everything is valid
 */
module.exports.postValidate = userParam => {
  const validator = new Validator();
  const check = validator.compile(schemas.login.post);
  return check(userParam);
};

module.exports.findUser = username => loginDAO.findActiveUser(username);
// eslint-disable-next-line
module.exports.comparePasswords = (hashedPassword, plainPassword) => {
  return new Promise((resolve, reject) => {
    bcrypt.compare(plainPassword, hashedPassword, (err, res) => {
      if (err) {
        reject(new Error('Unexpected error'));
      }
      resolve(res);
    });
  });
};

module.exports.generateToken = userInfo => {
  const exp = parseInt(
    moment()
      .add(conf.token.time, conf.token.unit)
      .format('X'),
    10,
  );
  const iat = parseInt(moment().format('X'), 10);
  const tokenPayload = {
    ...userInfo,
    iat,
    exp,
  };
  return jwt.encode(tokenPayload, conf.token.secret, conf.token.algorithm);
};

module.exports.registersuccessfulLogin = userParam => {
  const user = userParam;
  user.lastLogin = new Date();
  user.updatedAt = new Date();
  return user.save();
};
