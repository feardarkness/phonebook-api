'use strict';

const router = require('express').Router();
const acl = require('express-acl');
const contactsController = require('./contactsController');
const asyncroute = require('../../helpers/async-route');
const authMiddleware = require('../../init/middlewares/auth');

acl.config({
  filename: 'nacl.json',
});

router
  .post('', authMiddleware, acl.authorize, asyncroute(contactsController.post))
  .delete('/:id', authMiddleware, acl.authorize, asyncroute(contactsController.del))
  .get('', authMiddleware, acl.authorize, asyncroute(contactsController.get))
  .get('/:id', authMiddleware, acl.authorize, asyncroute(contactsController.getOne))
  // -- STARTTTT
  .patch('/:id', authMiddleware, acl.authorize, asyncroute(contactsController.patch));

module.exports = router;
