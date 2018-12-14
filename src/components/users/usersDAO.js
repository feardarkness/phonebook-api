'use strict';

const db = require('../../init/databases');
const userStatesEnum = require('../../enums/user-states');

const { Users: User, Contacts: Contact } = db.models;

/**
 * Creates an user
 * @param  {User} params
 * @returns {Object}
 */
module.exports.insertUser = params => {
  const user = new User({
    username: params.username,
    password: params.password,
    email: params.email,
    role: params.role,
    state: userStatesEnum.CREATED,
  });
  return user.save();
};

/**
 * Find one user by email or username
 * @param {Object} query
 * @param {Object} query.username
 * @param {Object} query.email
 */
module.exports.findUserByUsernameOrMail = query => {
  if (!query.username || !query.email) {
    throw new Error('username and email are required');
  }
  return User.findOne({
    state: userStatesEnum.CREATED,
    $or: [
      {
        username: query.username,
      },
      {
        email: query.email,
      },
    ],
  });
};

/**
 * Get list of users
 * @param {Object} query
 * @param {Object} query.limit
 * @param {Object} query.skip
 * @param {Object} query.fullFilter
 */
module.exports.getAllUsers = query =>
  // eslint-disable-next-line
  User.find(query.fullFilter, '-password -__v', {
    skip: query.skip,
    limit: query.limit,
  })
    .sort('_id')
    .exec();

/**
 * Count all users
 * @param {Object} query
 */
module.exports.countAllUsers = query => User.countDocuments(query).exec();

/**
 * Returns one user
 * @param {Object} params
 * @param {string} params._id User identifier
 */
module.exports.findUser = params => User.findOne(params, '-password -__v').exec();

/**
 *
 * @param {Object} userParam Mongoose user object
 */
module.exports.inactivateUser = userParam => {
  const user = userParam;
  user.state = userStatesEnum.INACTIVE;
  user.updatedAt = new Date();
  return user.save();
};

/**
 * Deletes all contacts
 * @param {String} userId - User id
 */
module.exports.deleteContacts = userId => Contact.deleteMany({ user: userId });

/**
 *
 * @param {Object} userParam Mongoose user object
 * @param {Object} data - Data to change
 * @param {string} data.password
 * @param {string} data.email
 * @param {string} data.role
 */
module.exports.modifyUser = (userParam, data) => {
  const user = userParam;
  if (data.password) {
    user.password = data.password;
  }
  if (data.email) {
    user.email = data.email;
  }
  if (data.role) {
    user.role = data.role;
  }
  user.updatedAt = new Date();
  return user.save();
};

/**
 * Find one user by email or username
 * @param {Object} query
 * @param {Object} query.username
 */
module.exports.findDistinctUserByMail = (mail, id) =>
  // eslint-disable-next-line
  User.findOne({
    state: userStatesEnum.CREATED,
    email: mail,
    _id: {
      $ne: id,
    },
  });
