const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema ({
  // document structure & rules defined here
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 2,
  },
  encryptedPassword: { type: String, required: true, },
  }, {
  // additional settings for the Schema class
  timestamps: true,
});

// "User" model --> "users" collection

const User = mongoose.model("User", userSchema);

module.exports = User;