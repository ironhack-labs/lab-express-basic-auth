const { Schema, model } = require("mongoose");

const bcrypt = require('bcryptjs')

const EMAIL_PATTERN = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
const PASSWORD_PATTERN = /^.{8,}$/i
const SALT_ROUNDS = 10

const userSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Name is required']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    match: [EMAIL_PATTERN, 'wrong mail formatting'],
    unique: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    match: [PASSWORD_PATTERN, 'Password must contain at least 8 chars!']
  }
})

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

const User = model('User', userSchema)
module.exports = User

// ENCRYPTING PASSWORD:

// npm install bcryptjs
// REQUIRE bcryptjs
// SET THE NUMBER OF SALT
// BEFORE SAVING , 
// IF NOT CREATING OR MODIFYING A PASSWORD => SAVE
// IF CREATING OR MODIFYING A PASSWORD
// ENCRYPT THE PASSWORD
// CHANGE THE VALUE OF USER.PASSWORD TO THE NEW ENCRYPTED ONE
// => SAVE


//const bcrypt = require('bcryptjs')
// const SALT_ROUNDS = 10

// userSchema.pre('save', function(next) {
//   const user = this;

//   if (user.isModified('password')) {
//     bcrypt.hash(user.password, SALT_ROUNDS)
//       .then((hash) => {
//         user.password = hash
//         next()
//       })
//       .catch(err => next(err))
//   } else {
//     next()
//   }