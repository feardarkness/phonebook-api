'use strict';

const { Schema } = require('mongoose');
const contactStatesEnum = require('../enums/contact-states');

const states = [contactStatesEnum.CREATED];

const contactSchema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: false,
  },
  company: {
    type: String,
    required: false,
  },
  phoneNumbers: [
    {
      _id: false,
      type: {
        type: String,
        required: true,
      },
      number: {
        type: String,
        required: true,
      },
    },
  ],
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  state: {
    type: String,
    enum: states,
    required: true,
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

module.exports.esquema = contactSchema;
module.exports.name = 'Contacts';
