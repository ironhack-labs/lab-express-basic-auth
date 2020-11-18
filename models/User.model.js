// User model here

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const userSchema = new Schema({
  username: String,
  password: String,
  githubId: String,
  avatar: String,
  name: String,
  googleId: String
});

const User = mongoose.model('User', userSchema);
module.exports = User;