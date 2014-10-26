var tempoUtils = {};
var gauss = require('gauss');


// This is the constant percent-similarity required for authentication. 
var REQUIRED_MEAN_SIMILARITY = 0.4;
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
  console.log(percentDifferencesMean, REQUIRED_MEAN_SIMILARITY);  
  if (percentDifferencesMean < REQUIRED_MEAN_SIMILARITY){
    callback(true);
  } else {
    callback(false);
  }
};

module.exports = tempoUtils;