'use strict';

const bcrypt = require('bcrypt');
const Validator = require('fastest-validator');
const usersDAO = require('./usersDAO');
const schemas = require('./schemas');
const ValidationError = require('../../errors/validation-error');
const filter = require('../../helpers/filter');
const userStatesEnum = require('../../enums/user-states');
const rolesEnums = require('../../enums/roles');

/**
 * @typedef {Object} User
 * @property {String} username
 * @property {String} password
 * @property {String} email
 * @property {String} role
 */

/**
 * Valida post
 * @param  {User} userParam
 * @returns {Array} Returns an array with errors
 */
module.exports.postValidate = userParam => {
  const validator = new Validator();
  const check = validator.compile(schemas.user.post);
  return check(userParam);
};

/**
 * Valida post for regular user
 * @param  {User} userParam
 * @returns {Array} Returns an array with errors
 */
module.exports.postValidateRegular = userParam => {
  const validator = new Validator();
  const check = validator.compile(schemas.user.postRegular);
  return check(userParam);
};

/**
 * Verify that user is not registered already
 * @param  {Object} params
 * @param  {string} params.mail
 * @param  {string} params.username
 */
module.exports.checkUserExists = async params => {
  const user = await usersDAO.findUserByUsernameOrMail(params).exec();
  if (user !== null) {
    throw new ValidationError('User already registered. Check your username and email.');
  }
};

/**
 * Creates an user
 * @param  {User} param
 */
module.exports.createUser = async param => {
  const user = await usersDAO.insertUser(param);
  return user.toJSON();
};

const hashPassword = password =>
  // eslint-disable-next-line
  new Promise((resolve, reject) => {
    bcrypt.hash(password, 12, (err, hash) => {
      if (err) {
        return reject(err);
      }
      return resolve(hash);
    });
  });
module.exports.hashPassword = hashPassword;

/**
 * @typedef {Object} GetParams
 * @property {String} limit
 * @property {String} page
 * @property {String} filter
 */

/**
 * Valida get
 * @param  {GetParams} params
 * @returns {Array|Boolean} Returns an array with errors or true if no errors are found
 */
module.exports.getValidate = params => {
  const validator = new Validator();
  const check = validator.compile(schemas.user.get);
  return check(params);
};

/**
 * Get users from database
 * @param  {GetParams} params
 * @returns {Array} Returns an array with the users paginated and filtered
 */
module.exports.getUsers = (params, loggedInUserId) => {
  let fullFilter = {};
  if (params.filter) {
    fullFilter = filter.makeFilter(params.filter);
  }
  const query = {
    limit: +params.limit,
    skip: (+params.page - 1) * +params.limit,
    fullFilter: {
      $and: [fullFilter],
    },
  };
  if (loggedInUserId !== null) {
    query.fullFilter.$and.push({ _id: loggedInUserId });
  }
  return usersDAO.getAllUsers(query);
};

/**
 * Count all users in database
 * @param  {GetParams} params
 * @returns {Integer} Returns a count from all the users
 */
module.exports.countUsers = (params, loggedInUserId) => {
  let fullFilter = {
    $and: [],
  };
  if (params.filter) {
    fullFilter.$and.push(filter.makeFilter(params.filter));
  }
  if (loggedInUserId !== null) {
    fullFilter.$and.push({ _id: loggedInUserId });
  }
  if (fullFilter.$and.length === 0) {
    fullFilter = {};
  }
  return usersDAO.countAllUsers(fullFilter);
};

module.exports.getActiveUser = userId =>
  // eslint-disable-next-line
  usersDAO.findUser({
    _id: userId,
    state: userStatesEnum.CREATED,
  });

module.exports.deleteUser = user => usersDAO.inactivateUser(user);

/**
 * Builds user filter if role is REGULAR
 * @param {Object} user Logged in user
 */
module.exports.getUserIdFilter = user => {
  let userId = null;
  if (user.role === rolesEnums.REGULAR) {
    userId = user._id; //eslint-disable-line
  }
  return userId;
};

/**
 * Delete all times related to an user
 * @param {Object} user - User object
 */
module.exports.deleteContacts = user => usersDAO.deleteContacts(user._id); // eslint-disable-line

/**
 * Valida post
 * @param  {User} userParam
 * @returns {Array} Returns an array with errors
 */
module.exports.patchValidate = userParam => {
  const validator = new Validator();
  const check = validator.compile(schemas.user.patch);
  return check(userParam);
};

module.exports.checkPermissions = (userToChange, params, loggedInUser) => {
  // eslint-disable-next-line
  if (loggedInUser.role === rolesEnums.REGULAR && !userToChange._id.equals(loggedInUser._id)) {
    throw new ValidationError('A regular user can change only his own info');
  }
  if (loggedInUser.role === rolesEnums.REGULAR && params.role) {
    throw new ValidationError('A regular user can not change his role');
  }
};

module.exports.changeData = async (user, params) => {
  let pass = null;
  if (params.password) {
    pass = await hashPassword(params.password);
  }
  if (params.email) {
    // eslint-disable-next-line
    const userWithSameMail = await usersDAO.findDistinctUserByMail(params.email, user._id);
    if (userWithSameMail !== null) {
      throw new ValidationError('Mail already registered');
    }
  }
  if (user.role === rolesEnums.REGULAR) {
    return usersDAO.modifyUser(user, {
      password: pass,
      email: params.email,
      role: params.role,
    });
  }
  return usersDAO.modifyUser(user, {
    password: pass,
    email: params.email,
    role: params.role,
  });
};

module.exports.verifyCreatePersmissions = () => {};
