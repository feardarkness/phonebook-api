'use strict';

const ValidationError = require('../../errors/validation-error');
const loginBL = require('./loginBL');
const UnauthorizedError = require('../../errors/unauthorized-error');

const post = async (req, res) => {
  const params = req.body;

  const isValid = await loginBL.postValidate(params);
  if (isValid !== true) {
    throw new ValidationError('Incorrect parameters', isValid);
  }

  const user = await loginBL.findUser(params.username);
  if (user === null) {
    throw new UnauthorizedError('Unauthorized');
  }
  const { lastLogin } = user;

  const passwordMatch = await loginBL.comparePasswords(user.password, params.password);
  if (!passwordMatch) {
    throw new UnauthorizedError('Unauthorized');
  }

  const token = loginBL.generateToken({
    userId: user._id, // eslint-disable-line
    role: user.role,
  });

  await loginBL.registersuccessfulLogin(user);

  res.json({
    token,
    lastLogin,
  });
};

module.exports = {
  post,
};
