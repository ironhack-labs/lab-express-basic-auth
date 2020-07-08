// User model here
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcrypt')

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
})

userSchema.pre('save', function(next) {
  if (this.isModified('password')) {
    bcrypt.hash(this.password, 10)
      .then(hash =>{
        this.password = hash
        next() 
    })
    .catch(error => next(error))
  } else {
    next()
  }
})

const User = mongoose.model('User', userSchema)

module.exports = User;