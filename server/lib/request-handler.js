var request = require('request');
var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
var util = require('../lib/utility');

/*var db = require('../app/config');
var User = require('../app/models/user');*/


/*
exports.renderIndex = function(req, res) {
  res.render('index');
};

exports.signupUserForm = function(req, res) {
  res.render('signup');
};

exports.loginUserForm = function(req, res) {
  res.render('login');
};

exports.logoutUser = function(req, res) {
  req.session.destroy(function(){
    res.redirect('/login');
  });
};

exports.fetchLinks = function(req, res) {
  Link.find(links).then(res.send(200, links)).catch(function(e){return console.log(err);});
  

  */
/*Link.find(function(err, links) {  // fixme: reset??
    if (err) {
      return console.log(err);
    }
    res.send(200, links);
  });*//*

};

exports.saveLink = function(req, res) {
  var uri = req.body.url;

  if (!util.isValidUrl(uri)) {
    console.log('Not a valid url: ', uri);
    return res.send(404);
  }

  Link.findOne({ url: uri }).exec(function(err, found) {
    if (err) { return console.log(err); }
    if (found) {
      res.send(200, found);
    } else {
      util.getUrlTitle(uri, function(err, title) {
        if (err) {
          console.log('Error reading URL heading: ', err);
          return res.send(404);
        }

        var link = Link({
          url: uri,
          title: title,
          base_url: req.headers.origin,
          visits: 0
        });

        link.save(function(err, newLink){
          if (err) { 
            console.log(err); 
          } else {
            res.send(200, newLink);
          }
        });
      });
    }
  });
};

exports.loginUser = function(req, res) {
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
};

exports.signupUser = function(req, res) {
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
    })
};

exports.navToLink = function(req, res) {
  Link.findOne({ code: req.params[0] }).exec(function(err, link) {
    if (err) { return console.log(err); }
    if (!link) {
      res.redirect('/');
    } else {
      link.visits = link.visits +1;
      // ({ visits: link.get('visits') + 1 })
      link.save(function(err, link) {
        if (err) { 
          return console.log(err);
        } else {
          return res.redirect(link.url);
        }
      });
    }
  });
};*/
