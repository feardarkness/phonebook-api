'use strict';

require('dotenv').config();
const boot = require('./src/init/boot');

const app = boot.start();

module.exports = app;
