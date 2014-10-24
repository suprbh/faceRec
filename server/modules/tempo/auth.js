var gauss = require('gauss');
var db = require('../../app/controllers/controller.js');
var fs = require('fs');

var REQUIRED_MEAN_SIMILARITY = .5;

module.exports = {
  setupRender: function(req, res){
    res.render('tempo/tempo-setup');
  },
  authRender: function(req, res){
    res.render('tempo/tempo-auth');
  },
  setup: function(req, res){
    var username = 'someUsername2';
    var userPairs = req.body;
    // var userIntervals = tempoUtils.findIntervals(userPairs);
    // var task = {};
    // task = userPairs;
    // db.saveAuthTask(username, 'tempo', {data:'string'}, function(error, authTask, user){
    //    console.log(user.tempo);
    // });
    fs.writeFile('data.json', JSON.stringify(req.body), function(err){
      console.log('saved to disk');
    });
    res.send('got it!');
  },
  auth: function(req, res){
    var username = 'someUsername2';
    var submittedUserPairs = req.body;
    fs.readFile('data.json', function(err, data){
      var referenceUserPairs = JSON.parse(data);
      tempoUtils.compareSamples(submittedUserPairs, referenceUserPairs, function(isMatch){
        if (isMatch){
          res.send('success');
        } else {
          res.status(403).send('Failed Authentication');
        }
      });
    });

    // db.readAuthTask(username, 'tempo', function(error, authTask, user){
    //   console.log()
    // });
  }
}

var tempoUtils = {};
tempoUtils.findMedians = function(userPairs){
  var results = {};
  for (var firstKey in userPairs){
    for (var secondKey in userPairs[firstKey]){
      var sample = userPairs[firstKey][secondKey];
      var set = new gauss.Vector(sample);
      results[firstKey] || (results[firstKey] = {});
      results[firstKey][secondKey] || (results[firstKey][secondKey] = {});
      results[firstKey][secondKey] = set.median();
      //console.log(firstKey, '->', secondKey, ': ', '(', set.median(), ')',  set);
    }
  }
  return results;
};
tempoUtils.compareSamples = function(submittedUserPairs, referenceUserPairs, callback){
  var submissionMedians = tempoUtils.findMedians(submittedUserPairs);
  var referenceMedians = tempoUtils.findMedians(referenceUserPairs);
  var percentDifferences = [];
  for (var firstKey in submissionMedians){
    for (var secondKey in submissionMedians[firstKey]){
      if (referenceMedians.hasOwnProperty(firstKey)){
        if (referenceMedians[firstKey].hasOwnProperty(secondKey)){
          var referenceMedian = referenceMedians[firstKey][secondKey];
          var submissionMedian = submissionMedians[firstKey][secondKey];
          percentDifferences.push((Math.abs(referenceMedian - submissionMedian)/referenceMedian))
        }
      }
    }
  }
  var percentDifferencesVector = gauss.Vector(percentDifferences);
  var percentDifferencesMean = percentDifferencesVector.mean();
  if (percentDifferencesMean < REQUIRED_MEAN_SIMILARITY){
    callback(true);
  } else {
    callback(false);
  }
};