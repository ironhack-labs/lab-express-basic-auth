const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SignUp = new Schema({
  username: String,
  password: String
});

const User = mongoose.model("User", SignUp);

module.exports = User;
