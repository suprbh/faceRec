var express = require('express');
var partials = require('express-partials');

var app = express();

app.configure(function() {
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(partials());
  app.use(express.bodyParser());
  app.use(express.static(__dirname + '/public'));
  app.use(express.cookieParser('shhhh, very secret'));
  app.use(express.session());
});

require('./modules/user/user-routes.js')(app);

app.get('/*', function(req, res) {
  res.end('Welcome to EasyAuth!');
});

module.exports = app;
