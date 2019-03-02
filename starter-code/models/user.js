let mongoose = require('mongoose');
let Schema   = mongoose.Schema;

let userSchema = new Schema({
  username: String,
  password: String,
  pictureUrl: String
});

let User = mongoose.model('User', userSchema);

module.exports = User;