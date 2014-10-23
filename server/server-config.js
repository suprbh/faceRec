var express = require('express');
var partials = require('express-partials');
var handler = require('./app/controllers/controller');
var util = require('./app/lib/utility');

var app = express();

// connect to MongoDB
require('./db-config');

app.configure(function() {
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(partials());
  app.use(express.bodyParser());
  app.use(express.static(process.cwd() + '/client'));
  app.use(express.cookieParser('shhhh, very secret'));
  app.use(express.session());
});

/*
  Define all routes here
 */
app.get('/module/:module', util.checkUser, handler.dispatchModule);

/* Password module routes */
var passwordModule = require('./modules/password/auth.js');
app.get('/modules/password/setup', util.checkUser, passwordModule.setupRender);
app.get('/modules/password/auth', util.checkUser, passwordModule.authRender);
app.post('/modules/password/setup', util.checkUser, passwordModule.setup);
app.post('/modules/password/auth', util.checkUser, passwordModule.auth);

app.get('/login', handler.loginForm);
app.post('/login', handler.login);
app.get('/index', handler.renderIndex);
app.get('/', handler.loginForm);

module.exports = app;
