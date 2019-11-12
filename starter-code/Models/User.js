const mongoose = require("mongoose");
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
    index: {
      unique: true
    }
  }
});

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;