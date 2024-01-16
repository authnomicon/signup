// Module dependencies.
var express = require('express');

exports = module.exports = function(promptHandler, createHandler) {
  var router = new express.Router();
  router.get('/', promptHandler);
  router.post('/', createHandler);
  
  return router;
};

// Module annotations.
exports['@implements'] = 'http://i.bixbyjs.org/http/Service';
exports['@path'] = '/signup';
exports['@require'] = [
  './handlers/prompt',
  './handlers/create'
];
