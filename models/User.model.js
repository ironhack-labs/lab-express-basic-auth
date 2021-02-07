// User model here
const mongoose = require("mongoose")
const { Schema, model } = require('mongoose');
const bcrypt = require ('bcrypt')
const EMAIL_PATTERN = /^(([^<>()[\]\\.,;:\s@']+(\.[^<>()[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const PASSWORD_PATTERN = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;

const SALT_ROUNDS = 10
 
const userSchema = new Schema(
  {
    email: {
      type: String,
      trim: true,
      required: [true, 'email is required.'],
      unique: true,
      lowercase:true,
      match: [EMAIL_PATTERN,'Email invalid']
    },
   
    password: {
      type: String,
      required: [true, 'Password is required.'],
      match :[PASSWORD_PATTERN,'Your password must contain at least: 1 uppercase, 1 lowercase, 1 number and 8 characters']
    },
  });

  userSchema.pre('save', function (next) {
    const user = this
    if (user.isModified('password')) {
        bcrypt.hash(user.password, SALT_ROUNDS)
            .then(hashPassword => {
                user.password = hashPassword
                next()
        })
    } else {
        next()
    }
})

const User = mongoose.model("User", userSchema)
 
module.exports = model('User', userSchema);