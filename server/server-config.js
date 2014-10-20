var express = require('express');
var partials = require('express-partials');
var handler = require('./app/controllers/controller');
var app = express();

// connect to MongoDB
require('./db-config');

app.configure(function() {
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(partials());
  app.use(express.bodyParser());
  app.use(express.static(__dirname + '/public'));
  app.use(express.cookieParser('shhhh, very secret'));
  app.use(express.session());
});

/*
  Define all routes here
 */

app.get('/index', handler.renderIndex);
app.get('/login', handler.loginForm);
app.get('/*', handler.loginForm);

module.exports = app;
