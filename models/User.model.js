// User model here
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema(
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
        match: [/^\S+@\S+\.\S+$/, 'Not a valid email.'],
        unique: true,
        lowercase: true,
        trim: true
      },
      passwordHash: {
        type: String,
        required: [true, 'Password is required.']
      }
    },
    {
      timestamps: true
    }
  );
  
  const User = mongoose.model('User', userSchema)
  module.exports = User;