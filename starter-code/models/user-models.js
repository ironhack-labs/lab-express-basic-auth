const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    // document structure & rules defined here
    username: { type: String, required: true, unique: true },
    encryptedPassword: { type: String, required: true }
  },
  {
    // additional settings for the Schema class defined here
    timestamps: true
  }
);

// "User" model -> "users" collection
const User = mongoose.model("User", userSchema);

module.exports = User;
