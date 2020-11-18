// User model here
const mongoose = require("mongoose");

userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true, unique: true },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
