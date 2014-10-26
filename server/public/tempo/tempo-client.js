$(function(){
  var pairs = {}; 
  var last; 

  var handleKeyDown = function(e){
    e.preventDefault();
    if (last) {
      var previousTime = last.timeStamp;
      var currentTime = e.timeStamp;
      var delay = currentTime - previousTime;
      pairs[last.keyCode] || (pairs[last.keyCode] = {});
      pairs[last.keyCode][e.keyCode] || (pairs[last.keyCode][e.keyCode] = []);
      pairs[last.keyCode][e.keyCode].push(delay); //.average //.nValue
    } 
    last = e;
    $('#text-area').text(
      $('#text-area').text() + e.keyCode + ' ' 
    );
  };

  var submitPairs = function(e){
    e.preventDefault();
    $.ajax({
      type: 'post',
      data: JSON.stringify(pairs),
      url: "",
      success: function(data){
        console.log(data);
        var response = JSON.parse(data);
        if (response.redirect){
          window.location = response.redirect;
        }
        if (response.token){
          $('body').html('<h1> Token: </h1>' + response.token);
        }
        if (response.rejected){
          $('body').html('<h1> Failed to authenticate </h1>');
        }
      },
      error: function(err){console.log(err);},
      contentType: 'application/JSON'
    });
  };
  $(document).on( 'keydown', handleKeyDown);
  $('form').on('submit', submitPairs);
});