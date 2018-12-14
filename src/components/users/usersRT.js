'use strict';

const router = require('express').Router();
const acl = require('express-acl');
const usersController = require('./usersController');
const asyncroute = require('../../helpers/async-route');
const authMiddleware = require('../../init/middlewares/auth');

acl.config({
  filename: 'nacl.json',
});

router
  .get('/:id', authMiddleware, acl.authorize, asyncroute(usersController.getOne))
  .post('', asyncroute(usersController.postRegularUser))
  .delete('/:id', authMiddleware, acl.authorize, asyncroute(usersController.del))
  .patch('/:id', authMiddleware, acl.authorize, asyncroute(usersController.patch));

module.exports = router;
