/**
* @module auth controller
 */

var User = require('../models/model');
var util = require('../lib/utility');
var path = require('path');

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
        var url = (user[module]) ? path.join(module, 'auth'): path.join(module, 'setup');
        res.redirect(url);
      } else {
        console.log('Use account does not exist');
        res.redirect('/login');
      }
    });
};

/**
 * Read auth task document from the database
 *
 * @param username - username used to fetch a User document
 * @param authName - the name of auth task to be read from the database
 * @param callback - this callback function is invoked with three arguments (error, authTask, user) after read
 */
exports.readAuthTask = function(username, authName, callback) {
  User.findOne({username: username})
    .exec(function(err, user) {
      if (err) {
        console.error(err);
      }

      if (callback) {
        callback(null, user.authName, user);
      }
    });
};

/**
 * Saves a new auth task document to the database as a sub-document of User document. This method overwrites if the document already exists.
 * If the given User document does not exist, a new User document gets created with the auth task.
 *
 * @param username - username used to fetch a User document
 * @param authName - the name of a auth module object to be saved to the database.
 * @param task - auth task object to be saved
 * @param callback - this callback is called with three arguments (error, authTask, user) after save
 */
exports.saveAuthTask = function(username, authName, task, callback) {
  User.findOne({username: username})
    .exec(function(err, user) {
      if (err) {
        console.error(err);
        callback(err);
      }

      if (!user) {
        user = new User({
          username: username
        });
      }

      user[authName] = [task];

      user.save(function(err, user) {
        if (err) {
          console.error(err);
        }

        if (callback) {
          callback(null, user.authName, user);
        }
      });
    });
};
