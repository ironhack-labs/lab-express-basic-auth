const { Schema, model } = require("mongoose");

var uniqueValidator = require('mongoose-unique-validator');

// TODO: Please make sure you edit the user model to 
//whatever makes sense in this case
const userSchema = new Schema({
  username: {
    type: String,
    unique: true,
    required: [true, 'Username is required.']
  },
  password: {
    type: String,
    required: [true, 'Password is required.']
  },
  email: {
    type: String,
    required: [true, 'Email is required.'],
    match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address.'],
    unique: true,
    uniqueCaseInsensitive: true,
    lowercase: true,
    trim: true
  },
});

const User = model("User", userSchema);

userSchema.plugin(uniqueValidator, { message: 'Error, expected {PATH} to be unique.' });

module.exports = model('User', userSchema);