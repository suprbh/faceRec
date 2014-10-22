var request = require('supertest');
var express = require('express');
var expect = require('chai').expect;
var app = require('../../server/server-config.js');

var db = require('../../server/db-config');
var User = require('../../server/app/models/model');

describe('Server-side integration specs suite', function() {

  // delete all documents in User collection for each test
  beforeEach(function(done) {
    User.remove(function(err) {
      if (err) throw err;

      done();
    });
  });

  it('should default to login page', function(done) {
    request(app)
      .get('/')
      .expect(200)
      .expect(function(res) {
        console.log('res', res);
        expect(res.header.location).to.be.equal('/login')
      })
      .end(done);
  });

});