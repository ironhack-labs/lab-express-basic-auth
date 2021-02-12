// User model here
const mongoose = require("mongoose");
const bcrypt = require('bcrypt')
const EMAIL_PATTERN = /^(([^<>()[\]\\.,;:\s@']+(\.[^<>()[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const PASSWORD_PATTERN = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;
const SALT_ROUNDS = 10

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Email is required.'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [EMAIL_PATTERN, 'Invalid email']
    },
    password: {
        type: String,
        required: [true, 'Password is required.'],
        match: [PASSWORD_PATTERN, 'Password needs 1 digit, 1 uppercase, 1 lowercase and at least 8 characters ']
     }
});

//Comparar con el hash de la DB

userSchema.methods.checkPassword = function (passwordToCheck) {
    return bcrypt.compare(passwordToCheck, this.password);
  };

// Antes de guardar el user hasear la contraseña
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
  
const User = mongoose.model('User', userSchema)
module.exports = User;
