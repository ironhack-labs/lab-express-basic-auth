// User model here
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: String,
  password: String,
  githubId: Number
});

const User = mongoose.model('User', userSchema);
module.exports = User;
