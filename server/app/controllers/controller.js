/**
* @module auth controller
 */

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

/**
 * This handler stores username into req.session and redirects it to the main index page
 *
 * @param req
 * @param res
 */
exports.login = function (req, res) {
  util.createSession(req, res, req.body.username);
};

/**
 * Handle module-specific request to appropriate route based on whether a user has auth rule set up or not.
 * If the user already has a specified auth rule defined, we redirect the request to /module/<module_name>/auth, otherwise to 'module/<module_name>/setup'
 *
 * @param req
 * @param res
 */
exports.dispatchModule = function (req, res) {
  var username = req.session.user;
  var module = req.params.module;

  User.findOne({username: username})
    .exec(function(err, user) {
      if (err) {
        console.error(err);
        res.redirect('login');
      }

      if (user) {
        // TODO: This is a temp fix.  Once we have a working authentication module, we will invoke its module here
        if (user['module']) {
          res.render('face-auth');
        } else {
          res.render('face-setup');
        }
      } else {
        console.log('Use account does not exist');
        res.redirect('/login');
      }
    });
};
