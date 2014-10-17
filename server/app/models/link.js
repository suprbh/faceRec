// var db = require('../config');
var mongoose = require('mongoose');
var crypto = require('crypto');

var urlSchema = new mongoose.Schema({
    url: String,
    base_url:   String,
    code: String,
    title: String,
    visits: {type: Number, default: 0}
});

var Link = mongoose.model('urls', urlSchema);

var createSha = function(url){
  var shasum = crypto.createHash('sha1');
  shasum.update('url');
  return shasum.digest('hex').slice(0, 5);
};

urlSchema.pre('save', function(next){
  this.code = createSha(this.url);
  next();
  
});

module.exports = Link;
