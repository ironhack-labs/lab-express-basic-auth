// User model here
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const EMAIL_PATTERN = /^(([^<>()[\]\\.,;:\s@']+(\.[^<>()[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const USERNAME_PATTERN = /^.{4,}$/
const PASSWORD_PATTERN = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;
const SALT_ROUNDS = 10

const userSchema = new mongoose.Schema({
    username: {
	    type: String,
        required: 'Username required',
        unique: true,
        lowercase: true,
        match: [USERNAME_PATTERN, 'Invalid format, username must have at least 4 characters'],
        trim: true
	},
    password: {
		type: String,
		required: 'Password required',
        match: [PASSWORD_PATTERN, 'Password must have at least 8 characters (1 uppercase, 1 lowercase, 1 letter and 1 number)']

	},
})

userSchema.pre('save', function(next) {
  const user = this

  if (user.isModified('password')) {
    bcrypt.hash(user.password, SALT_ROUNDS)
      .then(hash => {
        this.password = hash
        next()
      })
  } else {
    next()
  }
})

const User = mongoose.model("User", userSchema);

module.exports = User;