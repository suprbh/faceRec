// The module object will be assigned to module.exports
var fs = require('fs');
var passwordModule = {

  // moduleName is how the server routes incoming HTTP requests,
  // EG, a get to EasyAuth.com/password will be routed to the module 'password'
  moduleName: 'password',
  
  // When a user wants to set up a module, this function is called and
  // rendered at GET easyAuth.com/password/setup
  setupRender: function(req, res){
    var options = {};
    console.log(fs.readdirSync('.'));
    fs.readFile('./server/modules/password/views/setup.html', function(err, data){
      if (err) throw err;
      res.set('Content-Type', 'text/html');
      res.send(data);
    });
  },

  // When a user wants to login with a module, this function is called and
  // rendered for GET easyAuth.com/moduleName/login
  authRender: function(req, res){
    var options = {};
    fs.readFile('./server/modules/password/views/setup.html', function(err, data){
      if (err) throw err;
      res.set('Content-Type', 'text/html');
      res.send(data);
    });
  },

  // When the server recieves an HTTP request to POST EasyAuth.com/password/setup/
  // the server calls module.setup() with the request data. 
  setup: function(req, res, next){

  },

  // When the server recieves an HTTP request to POST EasyAuth.com/moduleName/setup/,
  // the server calls module.setup() with the request data and the previous stored user data.
  auth: function(req, res, next){
    return false;
  },
}

var utils = {};
utils.checkPassword = function(userProvidedPassword, storedPasswordHash){
    //TODO: Actually check the password
    return true;
};

module.exports = passwordModule;
