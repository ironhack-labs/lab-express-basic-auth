const mongoose = require("mongoose");
const Schema = mongoose.Schema
const bcrypt = require('bcryptjs')

const PASSWORD_PATTERN = /^.{8,}$/i
const SALT_ROUNDS = 10

const userSchema = new Schema({
  username: {
    type: String,
    unique: true,
    required: [true, 'Username field is required!']
  },
  password: {
    type: String,
    required: [true, 'Password field is required!'],
    match: [PASSWORD_PATTERN, 'The password needs to be at least 8 characters long!']
  }
});

userSchema.pre('save', function(next) {
  const user = this;

  if (user.isModified('password')) {
    bcrypt.hash(user.password, SALT_ROUNDS)
    .then((hash) => {
      user.password = hash
      next()
    })
    .catch(error => next(error))
  } else {
    next()
  }
})

userSchema.methods.checkPassword = function (password) {
  return bcrypt.compare(password, this.password)
}

const User = mongoose.model('User', userSchema);
module.exports = User;
