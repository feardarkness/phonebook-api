'use strict';

const helmet = require('helmet');
const bodyParser = require('body-parser');

module.exports = app => {
  app.set('json spaces', 2);
  app.use(bodyParser.json({ type: 'json' }));

  app.use(helmet());
};
