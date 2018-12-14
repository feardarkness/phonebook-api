'use strict';

/* eslint no-console: off */

const mongoose = require('mongoose');
const models = require('../models');
const { db: dbConfig } = require('../configurations');
const rolesEnum = require('../enums/roles');
const userStateEnum = require('../enums/user-states');

const connection = mongoose.createConnection(`mongodb://${dbConfig.ip}:${dbConfig.port}/${dbConfig.name}`, {
  useNewUrlParser: true,
});
mongoose.Promise = Promise;

mongoose.set('debug', true);

connection.on('error', err => {
  console.log(err);
});

const closeConn = () => {
  try {
    connection.close(() => {
      process.exit(0);
    });
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

process.on('SIGINT', closeConn).on('SIGTERM', closeConn);

Object.keys(models).forEach(model => {
  connection.model(models[model].nombre, models[model].esquema);
});

connection.on('connected', () => {
  const adminUser = new connection.models.Users({
    username: 'admin',
    password: '$2b$12$0GFaiLAFXqPPdQnuNXE3YO8xuCSUlNpwdiY.BWXRbqI.UNC1pWuPu',
    email: 'admin@gmail.com',
    role: rolesEnum.ADMIN,
    state: userStateEnum.CREATED,
  });
  const managerUser = new connection.models.Users({
    username: 'manager',
    password: '$2b$12$0GFaiLAFXqPPdQnuNXE3YO8xuCSUlNpwdiY.BWXRbqI.UNC1pWuPu',
    email: 'manager@gmail.com',
    role: rolesEnum.MANAGER,
    state: userStateEnum.CREATED,
  });
  connection.models.Times.deleteMany({})
    .then(() => connection.models.Users.deleteMany({}))
    .then(() => adminUser.save())
    .then(() => managerUser.save())
    .then(() => {
      console.log('\n ========== Users created successfuly ==========\n');
      closeConn();
      process.exit(0);
    })
    .catch(err => {
      closeConn();
      console.log(err);
      process.exit(1);
    });
});
