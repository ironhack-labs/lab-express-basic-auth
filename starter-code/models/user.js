// This model will have user-specific properties that all our users built based on this model will share.

const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const userSchema = new Schema({
  username: String,
  password: String
}, {
  timestamps: true
});

const User = mongoose.model("User", userSchema);

module.exports = User;