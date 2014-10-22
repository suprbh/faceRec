var fs = require('fs');
var bcrypt = require('bcrypt-nodejs');
var db = require('../../app/controllers/controller.js');
var utils = require('../../app/lib/utility.js');

var passwordModule = {
  
  // When a user wants to set up a module, this function is called and
  // rendered at GET easyAuth.com/password/setup
  setupRender: function(req, res){
    var options = {};
    fs.readFile('./server/views/password/setup.html', function(err, data){
      if (err) throw err;
      res.set('Content-Type', 'text/html');
      res.send(data);
    });
  },

  // When a user wants to login with a module, this function is called and
  // rendered for GET easyAuth.com/moduleName/login
  authRender: function(req, res){
    var options = {};
    fs.readFile('./server/views/password/auth.html', function(err, data){
      if (err) throw err;
      res.set('Content-Type', 'text/html');
      res.send(data);
    });
  },

  // When the server recieves an HTTP request to POST EasyAuth.com/password/setup/
  // the server calls module.setup() with the request data. 
  setup: function(req, res, next){
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

  // When the server recieves an HTTP request to POST EasyAuth.com/moduleName/setup/,
  // the server calls module.setup() with the request data and the previous stored user data.
  auth: function(req, res, next){
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
