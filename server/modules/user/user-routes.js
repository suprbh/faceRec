var userController = require('./user-controller.js');

module.exports = function (app) {
  app.get('/signin', userController.signinForm);
  app.post('/signin', userController.signin);
  app.post('/signup', userController.signup);
};
