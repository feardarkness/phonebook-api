'use strict';

const Validator = require('fastest-validator');
const contactsDAO = require('./contactsDAO');
const schemas = require('./schemas');
const filter = require('../../helpers/filter');

/**
 * @typedef {Object} Contact
 * @property {String} firstname
 * @property {String} lastname
 * @property {String} company
 * @property {String} userId
 * @property {Array} phoneNumbers
 * @property {String} phoneNumbers.type
 * @property {String} phoneNumbers.number
 */

/**
 * Validate post
 * @param  {Contact} params
 * @returns {Array} Returns an array with errors
 */
module.exports.postValidate = params => {
  const validator = new Validator();
  const check = validator.compile(schemas.contact.post);
  return check(params);
};

/**
 * Creates a contact
 * @param  {Contact} param
 */
module.exports.createContact = async param => {
  const contact = await contactsDAO.insertContact(param);
  return contact.toJSON();
};

/**
 * Get a particular contact by id
 * @param  {String} contactId
 */
module.exports.getContact = async (contactId, userId) => contactsDAO.findContact({ _id: contactId, user: userId });

/**
 * Delete all times related to an user
 * @param {Object} contact - Contact mongoose object
 */
module.exports.deleteContact = async contact => contactsDAO.deleteContact(contact);

/**
 * Validate get
 * @param  {GetParams} params
 * @returns {Array|Boolean} Returns an array with errors or true if no errors are found
 */
module.exports.getValidate = params => {
  const validator = new Validator();
  const check = validator.compile(schemas.contact.get);
  return check(params);
};

/**
 * @typedef {Object} GetParams
 * @property {String} limit
 * @property {String} page
 * @property {String} filter
 */

/**
 * Get users from database
 * @param  {GetParams} params
 * @returns {Array} Returns an array with the users paginated and filtered
 */
module.exports.getContacts = (params, loggedInUserId) => {
  let fullFilter = {};
  if (params.filter) {
    fullFilter = filter.makeFilter(params.filter);
  }
  const query = {
    limit: +params.limit,
    skip: (+params.page - 1) * +params.limit,
    fullFilter: {
      $and: [fullFilter],
    },
  };
  if (loggedInUserId !== null) {
    query.fullFilter.$and.push({ user: loggedInUserId });
  }
  return contactsDAO.getAllContacts(query);
};

/**
 * Count all users in database
 * @param  {GetParams} params
 * @returns {Integer} Returns a count from all the users
 */
module.exports.countContacts = (params, loggedInUserId) => {
  let fullFilter = {
    $and: [],
  };
  if (params.filter) {
    fullFilter.$and.push(filter.makeFilter(params.filter));
  }
  if (loggedInUserId !== null) {
    fullFilter.$and.push({ user: loggedInUserId });
  }
  if (fullFilter.$and.length === 0) {
    fullFilter = {};
  }
  return contactsDAO.countAllContacts(fullFilter);
};
