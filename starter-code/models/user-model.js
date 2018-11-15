const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userData = new Schema ({
  username: { type: String, required: true, unique: true },
  encryptedPassword: { type: String, required: true }
}, {
  timestamps: true
})

const User = mongoose.model("User", userData);

module.exports = User;