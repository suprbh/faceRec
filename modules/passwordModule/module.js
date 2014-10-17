// The module object will be assigned to module.exports
var passwordModule = {

  // moduleName is how the server routes incoming HTTP requests,
  // EG, a get to EasyAuth.com/password will be routed to the module 'password'
  moduleName: 'password',

  // Incoming authentication requests will come by this method 
  method: 'POST',

  // When a user wants to set up a module, this function is called and
  // rendered at easyAuth.com/moduleName/setup
  setupRender: function(){
    $element = $('<form></form>').on('submit', function(e){
      $.ajax({
        type: 'POST',
        url: 'easyAuth.com/password/setup/submit',
        data: $('#passwordField').val()
      });
    })
    .append('<input type = "text" id = "passwordField">')
    .append('<button type = "submit"> Submit </button>');
    return $element;
  },

  // When a user wants to login with a module, this function is called and
  // rendered at easyAuth.com/moduleName/login
  loginRender: function(){
    $element = $('<form></form>').on('submit', function(e){
      $.ajax({
        type: 'POST',
        url: 'easyAuth.com/password/login/submit',
        data: $('#passwordField').val()
      });
    })
    .append('<input type = "text" id = "passwordField">')
    .append('<button type = "submit"> Submit </button>');
    return $element;
  },

  // When the server recieves an HTTP request to EasyAuth.com/moduleName/setup/submit,
  // the server calls module.setup() with the request data. 
  setup: function(providedUserData){
    // Process providedUserData, eg by hashing
    return userDataForStorage;
  },

  // When the server recieves an HTTP request to EasyAuth.com/moduleName/setup/submit,
  // the server calls module.setup() with the request data and the previous stored user data.
  login: function(providedUserData, storedUserData){
    //if (providedUserData === storedUserData){
    //  return true;
    //}
    return false;
  },
}

var utils = {};
utils.checkPassword = function(userProvidedPassword, storedPasswordHash){
    //TODO: Actually check the password
    return true;
};

module.exports = passwordModule;
