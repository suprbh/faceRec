var User = require('./user-model');
var util = require('../../lib/utility.js');

module.exports = {

  signinForm: function(req, res) {
    res.render('login');
  },

  signin: function(req, res) {
    var username = req.body.username;
    var password = req.body.password;

    User.findOne({ username: username }).exec(function(err, user) {
      if (err) {
        console.log(err);
      } else {
        if (!user) {
          res.redirect('/login');
        } else {
          user.comparePassword(password, function(match) {
            if (match) {
              util.createSession(req, res, user);
            } else {
              res.redirect('/login');
            }
          });
        }
      }
    });
  },

  signup: function(req, res) {
    var username = req.body.username;
    var password = req.body.password;

    User.findOne({ username: username })
      .exec(function(err, user) {
        if (err) { console.log(err); }
        if (!user) {
          var newUser = new User({
            username: username,
            password: password
          });
          newUser.save(function(err, newUser) {
            if (err) { return console.log(err); }
            util.createSession(req, res, newUser);
          });
        } else {
          console.log('Account already exists');
          res.redirect('/signup');
        }
      });
  }
};
