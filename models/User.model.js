const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  username: {
    type: String,
    unique: true,
    match: [/^@[a-z0-9_-]{3,16}$/, 'Please use a valid username.'],
    trim: true,
    lowercase: true,
    required: [true, 'Username is required']
  },
  password: {
    type: String,
    required: [true, 'Password is required']
  } 
});

const User = model("User", userSchema);

module.exports = User;
