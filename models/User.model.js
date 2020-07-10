// User model here
const mongoose = require('mongoose')
const bcryptjs = require('bcryptjs')
const saltRounds = 10

const EMAIL_PATTERN = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      trim: true,
      lowercase: true,
      required: [true, 'Username is required']
    },
    email: {
      type: String,
      unique: true,
      trim: true,
      lowercase: true,
      required: [true, 'Email is required'],
      match: [EMAIL_PATTERN, 'Email is invalid']
    },
    password: {
      type: String,
      minlength: [8, 'Password must be a least 8 chars'],
      required: [true, 'Password is required']
    }
  },
  { timestamps: true }
)

userSchema.pre('save', function (next) {
  const user = this

  if (user.isModified('password')) {
    bcryptjs
      .genSalt(saltRounds)
      .then((salt) => {
        return bcryptjs.hash(user.password, salt).then((hash) => {
          user.password = hash
          next()
        })
      })
      .catch((error) => next(error))
  } else {
    next()
  }
})

const User = mongoose.model('User', userSchema)

module.exports = User
