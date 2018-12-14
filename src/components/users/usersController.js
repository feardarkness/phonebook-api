'use strict';

const objectid = require('objectid');
const ValidationError = require('../../errors/validation-error');
const userBL = require('./usersBL');
const NotFoundError = require('../../errors/not-found-error');
const UnauthorizedError = require('../../errors/unauthorized-error');
const rolesEnums = require('../../enums/roles');

const post = async (req, res) => {
  const params = req.body;
  const isValid = await userBL.postValidate(params);
  if (isValid !== true) {
    throw new ValidationError('Incorrect parameters', isValid);
  }
  await userBL.checkUserExists(params);
  userBL.verifyCreatePersmissions(params);
  params.password = await userBL.hashPassword(params.password);
  const user = await userBL.createUser(params);
  delete user.password;
  delete user.__v; // eslint-disable-line
  res.status(201).json(user);
};

const postRegularUser = async (req, res) => {
  const params = req.body;
  const isValid = await userBL.postValidateRegular(params);
  if (isValid !== true) {
    throw new ValidationError('Incorrect parameters', isValid);
  }
  await userBL.checkUserExists(params);
  params.password = await userBL.hashPassword(params.password);
  params.role = rolesEnums.REGULAR;
  const user = await userBL.createUser(params);
  delete user.password;
  delete user.__v; // eslint-disable-line
  res.status(201).json(user);
};

const get = async (req, res) => {
  const params = req.query;
  const isValid = await userBL.getValidate(params);
  if (isValid !== true) {
    throw new ValidationError('Incorrect parameters', isValid);
  }
  const loggedInUserId = userBL.getUserIdFilter(req.user);
  const [users, totalUsers] = await Promise.all([userBL.getUsers(params, loggedInUserId), userBL.countUsers(params, loggedInUserId)]);
  res.json({
    data: users,
    total: totalUsers,
    limit: params.limit,
    page: params.page,
  });
};

const getOne = async (req, res) => {
  const userId = req.params.id;
  if (!objectid.isValid(userId)) {
    throw new NotFoundError('User not found');
  }
  const loggedInUser = req.user;
  // eslint-disable-next-line
  if (loggedInUser._id.toString() !== userId) {
    throw new UnauthorizedError('Not enough permissions');
  }
  const user = await userBL.getActiveUser(userId);
  if (user === null) {
    throw new NotFoundError('User not found');
  }

  res.json(user);
};

const del = async (req, res) => {
  const userId = req.params.id;
  if (!objectid.isValid(userId)) {
    throw new NotFoundError('User not found');
  }

  const loggedInUser = req.user;
  // eslint-disable-next-line
  if (loggedInUser._id.toString() !== userId) {
    throw new UnauthorizedError('Not enough permissions');
  }

  const user = await userBL.getActiveUser(userId);
  if (user === null) {
    throw new NotFoundError('User not found');
  }
  await Promise.all([userBL.deleteUser(user), userBL.deleteContacts(user)]);
  res.status(204).json();
};

const patch = async (req, res) => {
  const params = req.body;
  const isValid = await userBL.patchValidate(params);
  if (isValid !== true) {
    throw new ValidationError('Incorrect parameters', isValid);
  }

  params.idUser = req.params.id;
  const user = await userBL.getActiveUser(params.idUser);
  if (user === null) {
    throw new NotFoundError('User not found');
  }
  userBL.checkPermissions(user, params, req.user); // eslint-disable-line
  const updatedUser = await userBL.changeData(user, params);
  const jsonUser = updatedUser.toJSON();
  delete jsonUser.password;
  res.status(200).json(jsonUser);
};

module.exports = {
  post,
  postRegularUser,
  get,
  del,
  getOne,
  patch,
};
