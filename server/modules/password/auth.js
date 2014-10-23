var fs = require('fs');
var db = require('../../app/controllers/controller.js');
var utils = require('../../app/lib/utility.js');

var passwordModule = {
  
/**
 * This function handles GET requests to /modules/password/setup,
 *  and renders the setup page.
 *
 * @param req
 * @param res
 */
  setupRender: function(req, res){
    res.render('password-setup');
  },

/**
 * This function handles GET requests to /modules/password/auth,
 * and renders the auth page.
 *
 * @param req
 * @param res
 */
  authRender: function(req, res){
    res.render('password-auth');
  },

/**
 * This function handles POST requests to /modules/password/setup,
 *  and saves the user's password-hash to the database.
 *
 * @param req
 * @param res
 */
  setup: function(req, res){
    var username = req.session.username;
    var userProvidedPassword = req.body.password;
    utils.hashPassword(userProvidedPassword, function(userProvidedPasswordHash){
      var task = {};
      task.password = userProvidedPasswordHash;
      db.saveAuthTask(username, 'password', task, function(error, authTask, user){
        res.redirect('/index');
      });
    });
  },

/**
 * This function handles POST requests to /modules/password/auth,
 *  and compares the hash of the user's submitted password with the hash
 *  stored in the database. 
 *
 * @param req
 * @param res
 */
  auth: function(req, res){
    var username = req.session.username;
    db.readAuthTask(username, 'password', function(error, authTask, user){
      var storedPasswordHash = user.password;
      var userProvidedPassword = req.body.password;
      var userProvidedPasswordHash = utils.hashPassword(userProvidedPassword);
      utils.comparePassword(userProvidedPassword, storedPasswordHash, function(isMatch){
        if (isMatch){
          //give token
        } else {
          res.status(403).send('Failed Authentication');
        }
      });
    });
  },
}

module.exports = passwordModule;
