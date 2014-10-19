var User = require('./user-model');
var util = require('../../lib/utility.js');

module.exports = {

  loginForm: function(req, res) {
    res.render('login');
  },

  signupForm: function(req, res) {
    res.render('signup');
  },

  renderIndex: function(req, res) {
    res.render('index');
  },

  loginUser: function(req, res) {
    var username = req.body.username;
    var password = req.body.password;

    User.findOne({ username: username }).exec(function(err, user) {
      if (err) {
        console.log(err);
      } else {
        if (!user) {
          console.log('User account does not exist');
          res.redirect('/signup');
        } else {
          res.redirect('/index');
          /*
          We do not check password here for now
          user.comparePassword(password, function(match) {
            if (match) {
              util.createSession(req, res, user);
            } else {
              res.redirect('/login');
            }
          });*/
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
            res.redirect('/index');
          });
        } else {
          console.log('Account already exists');
          res.redirect('/signup');
        }
      });
  }
};
