var express = require('express');
var partials = require('express-partials');
var morgan = require('morgan');
var handler = require('./app/controllers/controller');
var util = require('./app/lib/utility');
var passwordModule = require('./modules/password/auth.js');

var app = express();

// connect to MongoDB
require('./db-config');

app.configure(function() {
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(partials());
  app.use(morgan('dev'));
  app.use(express.bodyParser());
  app.use(express.static(__dirname + '/public'));
  app.use(express.cookieParser('shhhh, very secret'));
  app.use(express.session());
});

/*
  Define all routes here
 */
app.get('/module/:module', util.checkUser, handler.dispatchModule);

/* Password module routes */
app.get('/modules/password/setup', util.checkUser, passwordModule.setupRender);
app.get('/modules/password/auth', util.checkUser, passwordModule.authRender);
app.post('/modules/password/setup', util.checkUser, passwordModule.setup);
app.post('/modules/password/auth', util.checkUser, passwordModule.auth);

/* tempo module routes */
var tempoModule = require('./modules/tempo/auth.js');
app.get('/modules/tempo/setup', /*util.checkUser,*/ tempoModule.setupRender);
app.get('/modules/tempo/auth', /*util.checkUser,*/ tempoModule.authRender);
app.post('/modules/tempo/setup', /*util.checkUser,*/ tempoModule.setup);
app.post('/modules/tempo/auth', /*util.checkUser,*/ tempoModule.auth);


app.get('/login', handler.loginForm);
app.post('/login', handler.login);
app.get('/signup', handler.signupForm);
app.get('/index', handler.renderIndex);
app.get('/', handler.loginForm);

module.exports = app;
