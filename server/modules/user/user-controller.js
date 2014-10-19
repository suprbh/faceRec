var User = require('./user-model.js');

module.exports = {
  signinForm: function(req, res, next) {
    console.log('signinForm');
    res.end('signinForm');
  },
  signin: function(req, res, next) {
    console.log('signin');
    res.end('signin');
  },
  signup: function(req, res, next) {
    console.log('signup');
    res.end('signup');
  }
};
