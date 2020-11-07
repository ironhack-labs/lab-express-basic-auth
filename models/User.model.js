// User model here
const { Schema, model } = require('mongoose')

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    avatar: {
      type: String,
      default:
        "../images/user.svg"
    }
  }
)

module.exports = model('User', userSchema)