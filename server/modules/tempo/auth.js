var gauss = require('gauss');
var db = require('../../app/controllers/controller.js');

module.exports = {
  setupRender: function(req, res){
    res.render('tempo/tempo-setup');
  },
  authRender: function(req, res){
    res.render('tempo/tempo-auth');
  },
  setup: function(req, res){
    var username = 'someUsername';
    var userPairs = req.body;
    var userIntervals = tempoUtils.findIntervals(userPairs);
    var task = {};
    task = userPairs;
    db.saveAuthTask(username, 'tempo', task, function(error, authTask, user){
       if (error) throw error;
       //console.log('stored: ', authTask);
    });
    res.send('got it!');
  },
  auth: function(req, res){
    var username = 'someUsername';
    var submittedUserPairs = req.body;
    db.readAuthTask(username, 'tempo', function(error, authTask, user){
      var storedUserPairs = authTask;
      //console.log('recalled: ', authTask);
    });
  }
}

var tempoUtils = {};
tempoUtils.findIntervals = function(userPairs){
  for (var firstKey in userPairs){
    for (var secondKey in userPairs[firstKey]){
      var sample = userPairs[firstKey][secondKey];
      var set = new gauss.Vector(sample);
      //console.log(firstKey, '->', secondKey, ': ', '(', set.median(), ')',  set);
    }
  }
};