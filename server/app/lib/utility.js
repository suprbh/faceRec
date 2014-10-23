var bcrypt = require('bcrypt-nodejs');

var rValidUrl = /^(?!mailto:)(?:(?:https?|ftp):\/\/)?(?:\S+(?::\S*)?@)?(?:(?:(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[0-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))|localhost)(?::\d{2,5})?(?:\/[^\s]*)?$/i;

var isValidUrl = function(url) {
  return url.match(rValidUrl);
};

var isLoggedIn = function(req) {
  return req.session ? !!req.session.user : false;
};

/**
 * This util function is used to determine if a request contains a session.  If not, will redirect to login page
 *
 */
exports.checkUser = function(req, res, next) {
  if (isLoggedIn(req)) {
    res.redirect('/login');
  } else {
    next();
  }
};

exports.createSession = function(req, res, newUser) {
  return req.session.regenerate(function() {
      req.session.user = newUser;
      res.redirect('/index');
    });
};

exports.comparePassword = function(userProvidedPasswordHash, storedPasswordHash, callback){
  bcrypt.compare(userProvidedPasswordHash, storedPasswordHash, function(err, isMatch) {
    callback(isMatch);
  });
};

exports.hashPassword = function(userProvidedPassword, callback){
  bcrypt.hash(userProvidedPassword, null, null, function(err, hash){
    callback(hash);
  });
};

/**
 * This util function generates an authentication token
 *
 * @param callback - callback function to be invoked once auth token is generated
 */
exports.generateAuthToken = function(callback) {
  var token = 'fakeToken';

  if (callback) {
    callback(token);
  }
};
