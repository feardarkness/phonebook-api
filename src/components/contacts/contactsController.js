'use strict';

const objectid = require('objectid');
const ValidationError = require('../../errors/validation-error');
const contactsBL = require('./contactsBL');
const NotFoundError = require('../../errors/not-found-error');

const post = async (req, res) => {
  const params = req.body;
  params.userId = req.user._id.toString(); // eslint-disable-line

  const isValid = await contactsBL.postValidate(params);
  if (isValid !== true) {
    throw new ValidationError('Incorrect parameters', isValid);
  }
  const contact = await contactsBL.createContact(params);
  res.status(201).json(contact);
};

const del = async (req, res) => {
  const contactId = req.params.id;
  if (!objectid.isValid(contactId)) {
    throw new NotFoundError('Contact not found');
  }
  const userId = req.user._id.toString(); // eslint-disable-line
  const contact = await contactsBL.getContact(contactId, userId);
  if (contact === null) {
    throw new NotFoundError('Contact not found');
  }
  await contactsBL.deleteContact(contact);
  res.status(204).json();
};

const get = async (req, res) => {
  const params = req.query;
  const isValid = await contactsBL.getValidate(params);
  if (isValid !== true) {
    throw new ValidationError('Incorrect parameters', isValid);
  }
  const loggedInUserId = req.user._id.toString(); // eslint-disable-line
  const [contacts, totalContacts] = await Promise.all([
    contactsBL.getContacts(params, loggedInUserId),
    contactsBL.countContacts(params, loggedInUserId),
  ]);
  res.json({
    total: totalContacts,
    limit: params.limit,
    page: params.page,
    data: contacts,
  });
};

const getOne = async (req, res) => {
  const contactId = req.params.id;
  if (!objectid.isValid(contactId)) {
    throw new NotFoundError('Contact not found');
  }

  const loggedInUserId = req.user._id.toString(); // eslint-disable-line
  const contact = await contactsBL.getContact(contactId, loggedInUserId);
  if (contact === null) {
    throw new NotFoundError('Contact not found');
  }

  res.json(contact);
};

module.exports = {
  del,
  get,
  getOne,
  post,
};
