var passwordModule = {
  setupRender: function(){
    $element = $('<form></form>').append('<input type = "text" id = "passwordField">');
    return $element;
  },
  loginRender: function(){
    $element = $('<form></form>').append('<input type = "text" id = "passwordField">');
    return $element;
  },
  setup: function(providedUserData){

  },
  login: function(providedUserData){
    
  },
  authenticate: function(storedUserData){
    //if (providedUserData === storedUserData){
    //  return true;
    //}
  }  
}


/*


  function(storedUserData){
    var userProvidedPassword = $('#passwordField').val();
    if ( checkPassword( userProvidedPassword, storedUserData.passwordHash) )
  };
  var checkPassword = function(userProvidedPassword, storedPasswordHash){
    //TODO: Actually check the password
    return true;
  };*/