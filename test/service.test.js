/* global describe, it, expect */

var expect = require('chai').expect;
var sinon = require('sinon');
var factory = require('../../../com/signup/http/service');


describe('signup/http/service', function() {
  
  it('should be annotated', function() {
    expect(factory['@implements']).to.equal('http://i.bixbyjs.org/http/Service');
    expect(factory['@path']).to.equal('/signup');
  });
  
  describe('create', function() {
    function promptHandler() {};
    function createHandler() {};
    
    var service = factory(promptHandler, createHandler);
  
    it('should construct handler', function() {
      expect(service).to.be.a('function');
      expect(service.length).to.equal(3);
    });
  });
  
});
