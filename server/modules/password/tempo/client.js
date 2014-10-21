$(function(){
  var pairs = {}; 
  var last; 

  var handleKeyPress = function(e){
    if (last) {
      var previousTime = last.timeStamp;
      var currentTime = e.timeStamp;
      var delay = currentTime - previousTime;
      pairs[last.charCode] || (pairs[last.charCode] = {});
      pairs[last.charCode][e.charCode] || (pairs[last.charCode][e.charCode] = []);
      pairs[last.charCode][e.charCode].push(delay);
    } 
    last = e;
  };

  var submitPairs = function(){
    $.ajax({
      type: 'post',
      data: JSON.stringify(pairs),
      url: [host, 'modules', module].join('/');
      success: function(code){console.log(code);},
      error: function(err){console.log(err));}
      contentType: 'application/JSON'
    });
  };

  $(document).on( 'keypress', handleKeyPress);
  $('form').on( 'submit', submitPairs);
});