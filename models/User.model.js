// User model here
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    required: true,
    type: String,
    unique: true,
  },
  password: String,
});

const User = mongoose.model("User", userSchema);

module.exports = User;
