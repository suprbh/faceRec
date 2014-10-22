var gauss = require('gauss');

module.exports = {
  setupRender: function(req, res){
    res.render('tempo-setup');
  },
  authRender: function(req, res){
    res.render('tempo-auth');
  },
  setup: function(req, res){
    var username = req.session.username;
    var userPairs = req.body.pairs;
  },
  auth: function(req, res){

  }
}