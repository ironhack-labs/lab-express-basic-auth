// User model here
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    trim: true
  }
});

module.exports = mongoose.model("User", UserSchema);
