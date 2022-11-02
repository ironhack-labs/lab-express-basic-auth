const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  username: {
    type: String,
    trim: true,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, "Enter a valid e-mail"],
  },
  password: {
    type: String,
    required: true,
  },
  password: String,
});

const User = model("User", userSchema);

module.exports = User;
