// User model here
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const EMAIL_PATTERN = /^(([^<>()[\]\\.,;:\s@']+(\.[^<>()[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const USERNAME_PATTERN = /^.{4,}$/;
const PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
const SALT_ROUNDS = 10;

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
        match: [PASSWORD_PATTERN, `Invalid Password. Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character`]

	},
})

userSchema.methods.checkPassword = function (passwordToCheck) {
  return bcrypt.compare(passwordToCheck, this.password);
};

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