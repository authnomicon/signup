/* global describe, it, expect */

var expect = require('chai').expect;
var chai = require('chai');
var $require = require('proxyquire');
var sinon = require('sinon');
var factory = require('../../com/handlers/register');


describe('signup/handlers/register', function() {
  
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
    expect(bodyParserSpy).to.be.calledWith({ extended: false });
    expect(bodyParserSpy).to.be.calledBefore(csurfSpy);
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
    var mockStateStore = new Object();
    
    it('should create', function(done) {
      var passwords = new Object();
      passwords.create = sinon.stub().yieldsAsync(null, { id: '248289761001', displayName: 'Jane Doe' });
      
      var handler = factory(passwords, mockAuthenticator, mockStateStore);
      
      chai.express.use(handler)
        .request(function(req, res) {
          req.login = sinon.stub().yieldsAsync(null);
          
          req.method = 'POST';
          req.body = {
            username: 'jane',
            password: 'opensesame',
            csrf_token: '3aev7m03-1WTaAw4lJ_GWEMkjwFBu_lwNWG8'
          };
          req.session = {
            csrfSecret: 'zbVXAFVVUSXO0_ZZLBYVP9ue'
          };
          req.connection = {};
        })
        .finish(function() {
          expect(passwords.create).to.be.calledOnceWith({
            username: 'jane'
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
    }); // should create user
    
    it('should create user with name', function(done) {
      var passwords = new Object();
      passwords.create = sinon.stub().yieldsAsync(null, { id: '248289761001', displayName: 'Jane Doe' });
      
      var handler = factory(passwords, mockAuthenticator, mockStateStore);
      
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
    }); // should create user with name
    
    it('should create user and resume state', function(done) {
      var passwords = new Object();
      passwords.create = sinon.stub().yieldsAsync(null, { id: '248289761001', displayName: 'Jane Doe' });
      
      var handler = factory(passwords, mockAuthenticator, mockStateStore);
      
      chai.express.use(handler)
        .request(function(req, res) {
          req.login = sinon.stub().yieldsAsync(null);
          
          req.method = 'POST';
          req.body = {
            username: 'jane',
            password: 'opensesame',
            name: 'Jane Doe',
            return_to: '/continue',
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
          expect(this.getHeader('Location')).to.equal('/continue');
          done();
        })
        .listen();
    }); // should create user and resume state
    
    it('should error when failing to create user', function(done) {
      var passwords = new Object();
      passwords.create = sinon.stub().yieldsAsync(new Error('something went wrong'));
      
      var handler = factory(passwords, mockAuthenticator, mockStateStore);
      
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
    }); // should error when failing to create user
    
    it('should error when failing to log in', function(done) {
      var passwords = new Object();
      passwords.create = sinon.stub().yieldsAsync(null, { id: '248289761001', displayName: 'Jane Doe' });
      
      var handler = factory(passwords, mockAuthenticator, mockStateStore);
      
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
    }); // should error when failing to log in
    
  }); // handler
  
});
