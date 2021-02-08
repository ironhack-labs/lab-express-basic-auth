// User model here
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const PASSWORD_PATTERN = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;
const SALT_ROUNDS = 10

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: 'Please, provide an user name',
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: 'Please, provide a password',
      match: [PASSWORD_PATTERN, 'Invalid password (1 number, 1 uppercase, 1 lowercase, 8 character long)']
    }
  }
)

userSchema.pre('save', function(next) {
  if (this.isModified('password')) {
    bcrypt.hash(this.password, SALT_ROUNDS)
      .then(hash => {
        this.password = hash
        next()
      })
  } else {
    next()
  }
})

const User = mongoose.model('User', userSchema)
module.exports = User;