/* global describe, it, expect */

var expect = require('chai').expect;
var chai = require('chai');
var sinon = require('sinon');
var factory = require('../../../../com/signup/http/handlers/prompt');


describe('signup/http/handlers/prompt', function() {
  
  var handler;
  
  before(function() {
    function state() {
      return function(req, res, next) {
        next();
      };
    }
    
    //var stateSpy;
    
    //stateSpy = sinon.spy(state);
    
    handler = factory(undefined);
    
    //expect(stateSpy).to.be.calledOnce;
  });
  
  it('should prompt to create account', function(done) {
    
    chai.express.use(handler)
      .request(function(req, res) {
        req.connection = {};
        req.session = {};
      })
      .finish(function() {
        expect(this).to.have.status(200);
        expect(this).to.render('account/signup');
        expect(this).to.include.locals([ 'csrfToken' ]);
        done();
      })
      .listen();
    
  }); // should prompt to create account
  
});
