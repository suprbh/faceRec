var userController = require('./user-controller.js');

module.exports = function (app) {
  app.get('/login', userController.loginForm);
  app.post('/login', userController.loginUser);
  app.get('/signup', userController.signupForm);
  app.post('/signup', userController.signupUser);
  app.get('/index', userController.renderIndex);
  app.get('/', userController.loginForm);
};
