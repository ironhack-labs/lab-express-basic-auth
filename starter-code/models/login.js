// models/Cat.js

const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const loginSchema = new Schema({
  username : String,
  password: String
});

const Login = mongoose.model('Login', loginSchema);
module.exports = Login;