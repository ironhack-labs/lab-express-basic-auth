const mongoose = require('mongoose')
const { Schema } = mongoose

const userSchema = new Schema(
  {
    firstName: String,
    lastName: String,
    username: String,
    password: String
  },
  {
    versionKey: false,
    timestamp: true
  }
)

module.exports = mongoose.model('User', userSchema)