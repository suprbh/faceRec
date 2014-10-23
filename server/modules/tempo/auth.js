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
    var username = req.session.username;
    var userPairs = req.body;
    var task = {};
    task.intervals = tempoUtils.calculateIntervals(userPairs);
    db.saveAuthTask(username, 'password', task, function(error, authTask, user){
      res.redirect('/index');
    });
  },
  auth: function(req, res){
    //if median is within the interval, accept.
  }
}

var tempoUtils = {};
tempoUtils.calculateIntervals = function(pairs){
  return intervals;
};