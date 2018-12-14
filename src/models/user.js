'use strict';

const { Schema } = require('mongoose');
const rolesEnum = require('../enums/roles');
const userStatesEnum = require('../enums/user-states');

const states = [userStatesEnum.CREATED, userStatesEnum.INACTIVE];

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  key: {
    type: String,
  },
  role: {
    type: String,
    enum: [rolesEnum.REGULAR],
    required: true,
  },
  state: {
    type: String,
    enum: states,
    required: true,
  },
  lastLogin: {
    type: Date,
  },
  createdAt: {
    type: Date,
    required: true,
    default: new Date(),
  },
  updatedAt: {
    type: Date,
  },
});

module.exports.esquema = userSchema;
module.exports.name = 'Users';
