// The module object will be assigned to module.exports
var EJS = require('EJS');
console.log(typeof EJS);
var passwordModule = {

  // moduleName is how the server routes incoming HTTP requests,
  // EG, a get to EasyAuth.com/password will be routed to the module 'password'
  moduleName: 'password',
  
  // When a user wants to set up a module, this function is called and
  // rendered at GET easyAuth.com/password/setup
  setupRender: function(){
    var options = {};
    options.ajaxURL = '';
    var el = new EJS({url: '/templates/setup.ejs'}).render(null);
    return el;
  },

  // When a user wants to login with a module, this function is called and
  // rendered for GET easyAuth.com/moduleName/login
  authRender: function(postData){
    var options = {};
    options.ajaxURL = '';
    var el = new EJS({url: '/templates/auth.ejs'}).render(null);
    return el;
  },

  // When the server recieves an HTTP request to POST EasyAuth.com/password/setup/
  // the server calls module.setup() with the request data. 
  setup: function(){

  },

  // When the server recieves an HTTP request to POST EasyAuth.com/moduleName/setup/,
  // the server calls module.setup() with the request data and the previous stored user data.
  auth: function(){
    return false;
  },
}

var utils = {};
utils.checkPassword = function(userProvidedPassword, storedPasswordHash){
    //TODO: Actually check the password
    return true;
};

module.exports = passwordModule;
