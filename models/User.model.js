// User model here
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  userName: { type: String, unique: true },
  passHash: String,
});

const User = mongoose.model("User", userSchema);

module.exports = User;
