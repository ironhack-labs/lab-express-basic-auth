// models/Cat.js

const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const loginSchema = new Schema({
  username : String,
  password: String
});

const User = mongoose.model('User', loginSchema);
module.exports = User;