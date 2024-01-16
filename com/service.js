exports = module.exports = function(promptHandler, createHandler) {
  var express = require('express');
  
  var router = new express.Router();
  router.get('/', promptHandler);
  router.post('/', createHandler);
  
  return router;
};

exports['@implements'] = 'http://i.bixbyjs.org/http/Service';
exports['@path'] = '/signup';
exports['@require'] = [
  './handlers/prompt',
  './handlers/create'
];
