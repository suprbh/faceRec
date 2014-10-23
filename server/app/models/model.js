var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
    username: {type: String, required: true, index: {unique: true}},
    password: {type: String},
    fakeAuth: [ FaceAuthSchema ]
});
var User = mongoose.model('User', UserSchema);

/*
  Note: This is an ugly solution to extend UserSchema to run our unit tests
        We will remove this schema once we figure out a way to extend UserSchema dynamically
 */
var FaceAuthSchema = new mongoose.Schema({
  picture: String
});

User.prototype.comparePassword = function(attemptedPassword, callback) {
  bcrypt.compare(attemptedPassword, this.password, function(err, isMatch) {
    if (err) {
      return callback(err);
    } else {
      callback(isMatch);
    }
  });
};

/*userSchema.pre('save', function(next){
  bcrypt.hash(this.password, null, null, function(err, hash) {
    this.password = hash;
    next();
  });
});*/


module.exports = User;
