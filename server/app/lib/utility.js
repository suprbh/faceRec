var bcrypt = require('bcrypt-nodejs');
var jwt  = require('jwt-simple');

var isUserSessionPresent = function(req) {
  return req.session ? !!req.session.user : false;
};

/**
 * Check to see if a user session is present in the request
 * @param req
 * @param res
 * @param next
 */
exports.checkUser = function(req, res, next) {
  if (isUserSessionPresent(req)) {
    next();
  } else {
    res.redirect('/login');
  }
};

/**
 * Create a session
 * @param req
 * @param res
 * @param newUser
 * @returns {*}
 */
exports.createSession = function(req, res, newUser) {
  return req.session.regenerate(function() {
      req.session.user = newUser;
      res.redirect('/index');
    });
};

/**
 * Used to compare a given password with the saved password
 * @param userProvidedPasswordHash
 * @param storedPasswordHash
 * @param callback - callback to be invoked once password matches
 */
exports.comparePassword = function(userProvidedPasswordHash, storedPasswordHash, callback){
  bcrypt.compare(userProvidedPasswordHash, storedPasswordHash, function(err, isMatch) {
    callback(isMatch);
  });
};

/**
 * Generates a hashed password
 * @param userProvidedPassword
 * @param callback - callback to be invoked when hashed password is generated
 */
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

/**
 * Send a response to the client with a generated JWT token
 * @param res
 * @param user - user object to be used to generate a JWT token and stored into response header
 * @param statusCode - status code to be used
 */
exports.sendResponse = function(res, user, statusCode){
  var token = jwt.encode(user, 'secret');

  statusCode = statusCode || 200;
  res.writeHead(statusCode);
  res.end(JSON.stringify(token));
};

/**
 * Check to see if the user is authenticated by checking the JWT token being present in the header
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
exports.checkAuthToken = function (req, res, next) {
  var token = req.headers['x-access-token'];
  var user;

  if (!token) {
    res.redirect('/login');
  }

  try {
    user = jwt.decode(token, 'secret');
    req.user = user;
    next();
  } catch(error) {
    return next(error);
  }
};
