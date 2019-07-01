const mongoose = require('mongoose')
const {
  Schema
} = mongoose

const UserSchema = new Schema({
  username: String,
  password: String
}, {
  versionKey: false,
  timestamps: true
})

module.exports = mongoose.model('User', UserSchema)