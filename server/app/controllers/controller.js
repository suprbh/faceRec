var User = require('../models/model');
var util = require('../lib/utility');

exports.loginForm = function (req, res) {
  res.render('login');
};

exports.signupForm = function (req, res) {
  res.render('signup');
};

exports.renderIndex = function (req, res) {
  res.render('index');
};

exports.login = function (req, res) {
  util.createSession(req, res, req.body.username);
};
