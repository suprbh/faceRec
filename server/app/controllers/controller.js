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
 * This handler checks if a given user has an account.  If so, create a session and redirect to main menu page.
 * Otherwise, it'll create a new user account first and redirect.
 *
 * @param req
 * @param res
 */
exports.login = function (req, res) {
  var username = req.body.username;

  User.findOne({username: username})
    .exec(function(err, user) {
      if (!user) {
        var newUser = new User({username: username});
        newUser.save(function(err, newUser) {
          if( err ){
            return res.send(500, err);
          }
          util.createSession(req, res, username);
        });
      } else {
        // TODO: We should revisit this logic as redirecting to main index page blindly seems a bit strange
        // I think it's perfectly acceptable to ask a new user to provide username/password to create their account here
        util.createSession(req, res, username);
      }
    });
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
        if (user[module]) {
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
