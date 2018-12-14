'use strict';

const jwt = require('jwt-simple');
const userDAO = require('../../components/users/usersDAO');
const userStatesEnum = require('../../enums/user-states');
const UnauthorizedError = require('../../errors/unauthorized-error');
const config = require('../../configurations/app');

module.exports = async (req, res, next) => {
  const authorization = req.get('authorization');
  if (authorization === undefined) {
    return next(new UnauthorizedError('Unauthorized'));
  }

  const [prefix, token] = authorization.split(' ');
  if (prefix !== 'JWT') {
    return next(new UnauthorizedError('Unauthorized'));
  }

  let tokenDecoded;
  try {
    tokenDecoded = jwt.decode(token, config.token.secret, false, config.token.algorithm);
  } catch (err) {
    return next(new UnauthorizedError('Unauthorized'));
  }

  const user = await userDAO.findUser({
    _id: tokenDecoded.userId,
    state: userStatesEnum.CREATED,
  });

  if (user === null) {
    return next(new UnauthorizedError('Unauthorized'));
  }

  req.user = user;
  req.decoded = {
    role: user.role,
  };
  return next();
};
