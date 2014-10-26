var request = require('supertest');
var express = require('express');
var expect = require('chai').expect;
var app = require('../../server/server-config.js');

var db = require('../../server/db-config');
var User = require('../../server/app/models/model');

describe('Server-side integration test suite', function() {

  // delete all documents in User collection for each test
  beforeEach(function(done) {
    User.remove(function(err) {
      if (err) throw err;

      done();
    });
  });

  describe('app routes', function() {
    xit('should always default to login page', function(done) {
      request(app)
        .get('/')
        .expect(200)
        .expect(function(res) {
          expect(res.text).to.include('<title>EasyAuth</title>');
        })
        .end(done);
    });

    it('should be able to render login page', function(done) {
      request(app)
        .get('/login')
        .expect(200)
        .expect(function(res) {
          expect(res.text).to.include('<title>EasyAuth</title>');
        })
        .end(done);
    });

    it('should redirect to index page if a user submits username', function(done) {
      request(app)
        .post('/login')
        .send({username: 'john@example.com'})
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .expect(302)
        .expect(function(res) {
          expect(res.headers.location).to.equal('/index');
        })
        .end(done);
    });

    it('should be able to render index page', function(done) {
      request(app)
        .get('/index')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .expect(200)
        .expect(function(res) {
          expect(res.text).to.include('<h2>Menu</h2>');
          expect(res.text).to.include('Password');
          expect(res.text).to.include('Face');
        })
        .end(done);
    });

    it('should redirect to login page if a request to "/module/:module" does not have a session ', function(done) {
      request(app)
        .get('/modules/password')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .expect(302)
        .expect(function(res) {
          expect(res.headers.location).to.equal('/login');
        })
        .end(done);
    });
  });

  describe('main controller', function() {
    it('should create a user account when a user submits username for the first time', function(done) {
      var username = 'john@example.com';
      request(app)
        .post('/login')
        .send({username: username})
        .end(function() {
          User.findOne({username: username})
            .exec(function(err, user) {
              expect(user).not.to.be.null;
              expect(user.username).to.be.equal(username);
              done();
            });
        });
    });
  });

});