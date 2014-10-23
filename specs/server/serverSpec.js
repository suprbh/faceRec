var mongoose = require('mongoose');
var User = require('../../server/app/models/model');
var controller = require('../../server/app/controllers/controller');
var expect = require('chai').expect;

describe('serverSpec', function() {

  // delete all documents in User collection for each test
  beforeEach(function(done) {
    User.remove(function(err) {
      if (err) throw err;
      done();
    });
  });

  describe('readAuthTask', function() {
    it('should read auth task', function(done) {
      var username = 'john@example.com';
      var user = new User({
        username: username,
        face: [ {picture: 'foo'} ]
      });
      user.save(function() {
        // call readAuthTask to verify that we can read auth document from database
        controller.readAuthTask(username, 'face', function(err, auth, user) {
          expect(user).not.to.be.null;
          expect(user.username).to.be.equal(username);
          expect(auth).not.to.be.null;
          expect(auth.picture).to.be.equal('foo');
          done();
        });
      });
    });
  });

  describe('saveAuthTask', function() {

    it('should create a new user and auth task when user account does not exist', function(done) {
      var username = 'john@example.com';
      var task = {
        picture: 'foo'
      };

      controller.saveAuthTask(username, 'face', task, function(err, auth, user) {
        expect(user).not.to.be.null;
        expect(user.username).to.be.equal(username);
        expect(auth).not.to.be.null;
        expect(auth.picture).to.be.equal('foo');
        done();
      });
    });

    it('should overwrite auth task when the same auth task already exist', function(done) {
      var username = 'john@example.com';
      var task = {
        picture: 'foo'
      };

      controller.saveAuthTask(username, 'face', task, function(err, auth, user) {
        var newTask = {
          picture: 'bar'
        };

        controller.saveAuthTask(username, 'face', newTask, function(err, auth, user) {
          expect(user).not.to.be.null;
          expect(user.username).to.be.equal(username);
          expect(auth).not.to.be.null;
          expect(auth.picture).to.be.equal('bar');
          done();
        });
      });
    });
  });
});
