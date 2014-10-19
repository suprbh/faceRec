var User = require('./user-model');
var util = require('../../lib/utility.js');

module.exports = {

  loginForm: function(req, res) {
    res.render('login');
  },

  signupForm: function(req, res) {
    res.render('signup');
  },

  loginUser: function(req, res) {
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

  signupUser: function(req, res) {
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
