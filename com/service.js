// Module dependencies.
var express = require('express');

exports = module.exports = function(promptHandler, registerHandler) {
  var router = new express.Router();
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
