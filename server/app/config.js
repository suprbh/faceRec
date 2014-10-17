var mongo = require('mongodb');
var mongoose = require('mongoose');
var path = require('path');

if (process.env.PORT === undefined){
  process.env.mongoURI = 'mongodb://localhost:27017/shortlydb';
} else {
  process.env.mongoURI = 'mongodb://MongoLab-n:e2CREwn6qmW0zC4yjKtrsS3NUrS6KeXQ8r17NXL8Xm0-@ds041167.mongolab.com:41167/MongoLab-n';

}
mongoose.connect(process.env.mongoURI);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  // yay!
});

module.exports = db;
