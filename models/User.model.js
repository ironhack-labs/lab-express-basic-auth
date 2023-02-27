const { Schema, model } = require("mongoose");
var uniqueValidator = require('mongoose-unique-validator')

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = new Schema({
  username: {
    type: String,
    trim: true,
    required: [true, 'Username is required.'],
    unique: true
  },
  email: {
    type: String,
    required: [true, 'email is required'],
    match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address.'],
    unique: true,
    lowercase: true,
    trim: true
  },
  passwordHash: {
    type: String,
    required: [true, 'Password is required']
  }
  
},
{
  timestamps: true
});

userSchema.plugin(uniqueValidator)

const User = model("User", userSchema);

module.exports = User;
