const { Schema, model } = require("mongoose");
const bcrypt = require('bcryptjs')
const SALT_ROUNDS = 10

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = new Schema({
  username: {
    type: String,
    trim: true,
    required: false,
    unique: true
  },
  password: String
});

const User = model("User", userSchema);

module.exports = User;
