const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// CREATE SCHEMA
const userSchema = new Schema(
  {
    username: {type: String, unique: true, required: true},
    password: {type: String, required: true},
  }
);

// CREATE MODEL
const User = mongoose.model("User", userSchema);

module.exports = User;
