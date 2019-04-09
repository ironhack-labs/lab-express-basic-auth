const mongoose = require('mongoose')


const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 1,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  }
})

const User = mongoose.model('User',userSchema)
module.exports = User