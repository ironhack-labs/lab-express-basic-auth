const mongoose = require('mongoose')
const {Schema} = mongoose

const UserSchema = new Schema(
  {
    username: String,
    password: String
  },
  {
    timestamps: true,
    versionKey: false
  }
)

module.exports = mongoose.model('User', UserSchema)