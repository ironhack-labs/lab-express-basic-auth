const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/* const { Schema, model } = require("mongoose");*/
const bcrypt = require('bcryptjs')

const EMAIL_PATTERN = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
const PASSWORD_PATTERN = /^.{8,}$/i
const SALT_ROUNDS = 10


const userSchema = new Schema({
  name: {
    type: String,
    required: [true, "Name is required"]
  },
  email: {
    type: String,
    required: [true,'Email is required'],
    match: EMAIL_PATTERN,
    unique: true
  },
  password:{
    type: String,
    required: [true,'Password is required'],
    match: [PASSWORD_PATTERN,'Password must be at least 8 chars long']
  } 
});

//IMP!!!
//Down below we dont use an arrow function because if so we would lose the context 
//of the function and then we wouldnt be able to use "this" inside it

userSchema.pre('save', function(next) {
  const user = this;

  if (user.isModified('password')) {
    bcrypt.hash(user.password, SALT_ROUNDS)
      .then((hash) => {
        user.password = hash
        next()
      })
      .catch(err => next(err))
  } else {
    next()
  }
})


userSchema.methods.checkPassword = function(password) {
  return bcrypt.compare(password, this.password)
}

const User = mongoose.model('User', userSchema);
module.exports = User;

