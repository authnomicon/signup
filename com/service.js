// Module dependencies.
var express = require('express');

/**
 * Create signup service.
 *
 * @param {express.RequestHandler} promptHandler - Handler which prompts the
 *          user to sign up.
 * @param {express.RequestHandler} registerHandler - Handler which registers the
 *          user using the user-supplied information.
 * @returns {express.Router}
 */
exports = module.exports = function(promptHandler, registerHandler) {
  var router = express.Router();
  router.get('/', promptHandler);
  router.post('/', registerHandler);
  
  return router;
};

// Module annotations.
exports['@implements'] = 'http://i.bixbyjs.org/http/Service';
exports['@path'] = '/signup';
exports['@require'] = [
  './handlers/prompt',
  './handlers/register'
];
