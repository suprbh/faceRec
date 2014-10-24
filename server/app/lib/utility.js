var bcrypt = require('bcrypt-nodejs');

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
 * Error handler used to send error message to the client with 500 status code
 * @param req
 * @param res
 * @param {Object} error - error object to be sent to the client
 */
exports.errorHandler = function(error, req, res, next) {
  res.send(500, {error: error.message});
};

