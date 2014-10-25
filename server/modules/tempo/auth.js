var gauss = require('gauss');
var utils = require('../../app/lib/utility.js');
var db = require('../../app/controllers/controller.js');
var model = require('../../app/models/model.js');
var fs = require('fs');

// This is the constant percent-similarity required for authentication. 
var REQUIRED_MEAN_SIMILARITY = 0.5;

module.exports = {
  /**
 * This function handles GET requests to /modules/tempo/setup,
 *  and renders the setup page.
 *
 * @param req
 * @param res
 */
  setupRender: function(req, res){
    res.render('tempo/tempo-setup');
  },

  /**
 * This function handles GET requests to /modules/tempo/auth,
 *  and renders the setup page.
 *
 * @param req
 * @param res
 */
  authRender: function(req, res){
    res.render('tempo/tempo-auth');
  },
  /**
 * This function handles the submission of a Tempo object from the client, 
 * saving it to the database.
 *
 * @param req
 * @param res
 */
  setup: function(req, res){
    var username = req.session.username;
    var userPairs = req.body;
    var task = {};
    task.pairs = userPairs;
    db.saveAuthTask(username, 'tempo', task, function(error, authTask, user){
       if (error) console.log(error);
    });
    res.redirect('/index');
  },

  /**
 * This function handles the submission of a Tempo object from the client, 
 * comparing it to the value stored in the database.
 *
 * @param req
 * @param res
 */
  auth: function(req, res){
    var username = req.session.username;
    var submittedUserPairs = req.body;
    db.readAuthTask(username, 'tempo', function(error, authTask, user){
      var referenceUserPairs = authTask.pairs;
      tempoUtils.compareSamples(submittedUserPairs, referenceUserPairs, function(isMatch){
        if (isMatch){
          utils.sendResponse(res, username)
        } else {
          res.status(403).send('Failed Authentication');
        }
      });
    });
  }
}

var tempoUtils = {};

  /**
 * This function takes a Tempo object, and returns the median delay 
 *  for each keyCode-pair.
 *
 * @param userPairs
 */
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
  /**
 * This function takes an object with numeric keys, the values of which 
 *  are objects with numeric keys and integer-array values, representing 
 *  a sample of the delays a user made between two given keys. 
 * It returns the median delay for each keyCode-pair in a nested object. 
 *
 * @param submittedUserPairs
 * @param referenceUserPairs
 * @param callback
 */
tempoUtils.compareSamples = function(submittedUserPairs, referenceUserPairs, callback){
  // Take the collected samples and replace them with the medians for each set
  var submissionMedians = tempoUtils.findMedians(submittedUserPairs);
  var referenceMedians = tempoUtils.findMedians(referenceUserPairs);

  var percentDifferences = [];
  // For every key on the keyboard, 
  for (var firstKey in submissionMedians){
    // followed by each other key,
    for (var secondKey in submissionMedians[firstKey]){
      // if we have data for that pair in both data sets,
      if (referenceMedians.hasOwnProperty(firstKey)){
        if (referenceMedians[firstKey].hasOwnProperty(secondKey)){
          // take the median of the setup data,
          var referenceMedian = referenceMedians[firstKey][secondKey];
          // and take the median of the submitted data,
          var submissionMedian = submissionMedians[firstKey][secondKey];
          // calculate the percent-difference
          var percentDifference = Math.abs(referenceMedian - submissionMedian)/
                                            ((referenceMedian + submissionMedian)/2);
          // then push it to a results array.                                 
          percentDifferences.push(percentDifference);
        }
      }
    }
  }
  // Use the Gauss stats library to find the mean of the differences for each pair, 
  var percentDifferencesVector = gauss.Vector(percentDifferences);
  var percentDifferencesMean = percentDifferencesVector.mean();
  // and if the percent difference is low enough, authenticate the user. 
  if (percentDifferencesMean < REQUIRED_MEAN_SIMILARITY){
    callback(true);
  } else {
    callback(false);
  }
};