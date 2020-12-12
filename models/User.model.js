const mongoose = require('mongoose');

const emailRegex = /^\S+@\S+\.\S+$/;
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      trim: true,
      required: [true, 'Username is required.'],
      unique: true
    },
    email: {
      type: String,
      required: [true, 'Email is required.'],
      unique: true,
      trim: true,
      match: [emailRegex, 'Please use a valid email address']
    },
    password: {
      type: String,
      required: [true, 'Password is required.'],
      trim: true,
    }
  },
);

module.exports = mongoose.model('User', userSchema);
