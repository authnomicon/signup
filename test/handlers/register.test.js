/* global describe, it, expect */

var expect = require('chai').expect;
var chai = require('chai');
var $require = require('proxyquire');
var sinon = require('sinon');
var factory = require('../../com/handlers/register');


describe('signup/handlers/create', function() {
  
  it('should create handler', function() {
    var bodyParserSpy = sinon.spy();
    var csurfSpy = sinon.spy();
    var flowstateSpy = sinon.spy();
    var factory = $require('../../com/handlers/register', {
      'body-parser': { urlencoded: bodyParserSpy },
      'csurf': csurfSpy,
      'flowstate': flowstateSpy
    });
    
    var authenticator = new Object();
    authenticator.initialize = sinon.spy();
    var store = new Object();
    var handler = factory(undefined, authenticator, store);
    
    expect(handler).to.be.an('array');
    expect(bodyParserSpy).to.be.calledOnce;
    expect(bodyParserSpy).to.be.calledBefore(csurfSpy);
    expect(bodyParserSpy).to.be.calledWith({ extended: false });
    expect(csurfSpy).to.be.calledOnce;
    expect(csurfSpy).to.be.calledBefore(flowstateSpy);
    expect(flowstateSpy).to.be.calledOnce;
    expect(flowstateSpy).to.be.calledWith({ store: store });
    expect(flowstateSpy).to.be.calledBefore(authenticator.initialize);
    expect(authenticator.initialize).to.be.calledOnce;
  });
  
  describe('handler', function() {
    
    var mockAuthenticator = new Object();
    mockAuthenticator.initialize = function() {
      return function(req, res, next) {
        next();
      };
    };
    var noopStateStore = new Object();
    
    
    it('should create user with password and resume state', function(done) {
      var passwords = new Object();
      passwords.create = sinon.stub().yieldsAsync(null, { id: '248289761001', displayName: 'Jane Doe' });
      
      var handler = factory(passwords, mockAuthenticator, noopStateStore);
      
      chai.express.use(handler)
        .request(function(req, res) {
          req.login = sinon.stub().yieldsAsync(null);
          
          req.method = 'POST';
          req.body = {
            username: 'jane',
            password: 'opensesame',
            name: 'Jane Doe',
            return_to: '/signed-up',
            csrf_token: '3aev7m03-1WTaAw4lJ_GWEMkjwFBu_lwNWG8'
          };
          req.session = {
            csrfSecret: 'zbVXAFVVUSXO0_ZZLBYVP9ue'
          };
          req.connection = {};
        })
        .finish(function() {
          expect(passwords.create).to.be.calledOnceWith({
            username: 'jane',
            displayName: 'Jane Doe'
          }, 'opensesame');
          expect(this.req.login).to.be.calledOnceWith({
            id: '248289761001',
            displayName: 'Jane Doe'
          });
          
          expect(this.statusCode).to.equal(302);
          expect(this.getHeader('Location')).to.equal('/signed-up');
          done();
        })
        .listen();
    }); // should create user with password and resume state
    
    it('should create user with password and redirect when no state', function(done) {
      var passwords = new Object();
      passwords.create = sinon.stub().yieldsAsync(null, { id: '248289761001', displayName: 'Jane Doe' });
      
      var handler = factory(passwords, mockAuthenticator, noopStateStore);
      
      chai.express.use(handler)
        .request(function(req, res) {
          req.login = sinon.stub().yieldsAsync(null);
          
          req.method = 'POST';
          req.body = {
            username: 'jane',
            password: 'opensesame',
            name: 'Jane Doe',
            csrf_token: '3aev7m03-1WTaAw4lJ_GWEMkjwFBu_lwNWG8'
          };
          req.session = {
            csrfSecret: 'zbVXAFVVUSXO0_ZZLBYVP9ue'
          };
          req.connection = {};
        })
        .finish(function() {
          expect(passwords.create).to.be.calledOnceWith({
            username: 'jane',
            displayName: 'Jane Doe'
          }, 'opensesame');
          expect(this.req.login).to.be.calledOnceWith({
            id: '248289761001',
            displayName: 'Jane Doe'
          });
          
          expect(this.statusCode).to.equal(302);
          expect(this.getHeader('Location')).to.equal('/');
          done();
        })
        .listen();
    }); // should create user with password and redirect when no state
    
    it('should next with error when user with password fails to be created', function(done) {
      var passwords = new Object();
      passwords.create = sinon.stub().yieldsAsync(new Error('something went wrong'));
      
      var handler = factory(passwords, mockAuthenticator, noopStateStore);
      
      chai.express.use(handler)
        .request(function(req, res) {
          req.login = sinon.stub().yieldsAsync(null);
          
          req.method = 'POST';
          req.body = {
            username: 'jane',
            password: 'opensesame',
            name: 'Jane Doe',
            csrf_token: '3aev7m03-1WTaAw4lJ_GWEMkjwFBu_lwNWG8'
          };
          req.session = {
            csrfSecret: 'zbVXAFVVUSXO0_ZZLBYVP9ue'
          };
          req.connection = {};
        })
        .next(function(err, req, res) {
          expect(err).to.be.an.instanceof(Error);
          expect(err.message).to.equal('something went wrong');
          expect(req.login).to.not.be.called;
          done();
        })
        .listen();
    }); // should next with error when user with password fails to be created
    
    it('should next with error when login session fails to be established', function(done) {
      var passwords = new Object();
      passwords.create = sinon.stub().yieldsAsync(null, { id: '248289761001', displayName: 'Jane Doe' });
      
      var handler = factory(passwords, mockAuthenticator, noopStateStore);
      
      chai.express.use(handler)
        .request(function(req, res) {
          req.login = sinon.stub().yieldsAsync(new Error('something went wrong'));
          
          req.method = 'POST';
          req.body = {
            username: 'jane',
            password: 'opensesame',
            name: 'Jane Doe',
            csrf_token: '3aev7m03-1WTaAw4lJ_GWEMkjwFBu_lwNWG8'
          };
          req.session = {
            csrfSecret: 'zbVXAFVVUSXO0_ZZLBYVP9ue'
          };
          req.connection = {};
        })
        .next(function(err, req, res) {
          expect(err).to.be.an.instanceof(Error);
          expect(err.message).to.equal('something went wrong');
          expect(passwords.create).to.be.calledOnce;
          done();
        })
        .listen();
    }); // should next with error when login session fails to be established
    
  }); // handler
  
});
