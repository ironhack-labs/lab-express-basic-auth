const { Schema, model } = require('mongoose')

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = new Schema({
  username: {
    type: String,
    unique: true,
    trim: true,
    lowercase: true,
    required: [true, 'Username is required']
  },
  passwordHash: {
    type: String,
    require: [true, `Password is required`]
  }
})

const User = model('User', userSchema)

module.exports = User
