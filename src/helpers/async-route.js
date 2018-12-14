'use strict';

/**
 * Catchs all route errors
 * @param  {Object} req
 * @param  {Object} res
 * @param  {Function} next
 */
module.exports = controller => (req, res, next) => {
  Promise.resolve(controller(req, res, next)).catch(next);
};
