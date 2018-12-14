'use strict';

const router = require('express').Router();
const loginController = require('./loginController');
const asyncroute = require('../../helpers/async-route');

router.post('', asyncroute(loginController.post));

module.exports = router;
