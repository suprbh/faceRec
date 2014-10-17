var passwordModule = {
  moduleName: 'password',
  method: 'POST',
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
  setup: function(providedUserData){
    // Process providedUserData, eg by hashing
    return userDataForStorage;
  },
  login: function(providedUserData, storedUserData){
    //if (providedUserData === storedUserData){
    //  return true;
    //}
    return false;
  },
  authenticate: function(storedUserData){

  }  
}

module.exports = passwordModule;

/*


  function(storedUserData){
    var userProvidedPassword = $('#passwordField').val();
    if ( checkPassword( userProvidedPassword, storedUserData.passwordHash) )
  };
  var checkPassword = function(userProvidedPassword, storedPasswordHash){
    //TODO: Actually check the password
    return true;
  };*/