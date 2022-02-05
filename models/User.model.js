const mongoose = require("mongoose");
const Schema = mongoose.Schema
const bcrypt = require('bcryptjs')

const PASSWORD_PATTERN = /^.{8,}$/i

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = new Schema({
  username: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true,
    match: PASSWORD_PATTERN
  }
});

const User = mongoose.model("User", userSchema);

module.exports = User;
