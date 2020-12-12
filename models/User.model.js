// User model here
const { Schema, model } = require('mongoose');

const emailRegex = /^\S+@\S+\.\S+$/;

const userSchema = new Schema(
  {
    username: {
      type: String,
      trim: true,
      required: [true, 'Username is required.'],
      unique: true,
      match: [emailRegex, "Please use a valid email address"],
    },
    email: {
      type: String,
      required: [true, 'Email is required.'],
      unique: true,
      lowercase: true,
      trim: true
    },
    passwordHash: {
      type: String,
      required: [true, 'Password is required.'],
      trim: true,
    }
  },
  {
    timestamps: true
  }
);

module.exports = model('User', userSchema);

