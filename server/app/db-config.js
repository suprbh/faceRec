var mongo = require('mongodb');
var mongoose = require('mongoose');
var path = require('path');

mongoURI = process.env.MONGOLAB_URI || 'mongodb://localhost/easy-auth';
mongoose.connect(mongoURI);
mongoose.connect(process.env.mongoURI);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  console.log('Mongodb connection open');
});

module.exports = db;
