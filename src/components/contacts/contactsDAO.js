'use strict';

const db = require('../../init/databases');
const contactStatesEnum = require('../../enums/contact-states');

const { Contacts: Contact, Users: User } = db.models;

/**
 * Creates a contact
 * @param  {Contact} params
 * @returns {Object}
 */
module.exports.insertContact = params => {
  const contact = new Contact({
    firstName: params.firstName,
    lastName: params.lastName,
    user: params.userId,
    phoneNumbers: params.phoneNumbers,
    state: contactStatesEnum.CREATED,
  });
  return contact.save();
};

/**
 * Deletes a contact
 * @param {Object} contact - Contact mongoose object
 */
module.exports.deleteContact = contact => contact.remove();

/**
 * Returns one contact
 * @param {Object} params
 * @param {string} params._id User identifier
 */
module.exports.findContact = params => Contact.findOne(params).exec();
/**
 * Get list of users
 * @param {Object} query
 * @param {Object} query.limit
 * @param {Object} query.skip
 * @param {Object} query.fullFilter
 */
module.exports.getAllContacts = query =>
  // eslint-disable-next-line
  Contact.find(query.fullFilter, '-__v', {
    skip: query.skip,
    limit: query.limit,
  })
    .sort('_id')
    .exec();

/**
 * Count all users
 * @param {Object} query
 */
module.exports.countAllContacts = query => Contact.countDocuments(query).exec();
