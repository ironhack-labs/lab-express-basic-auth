const { Schema, model } = require('mongoose')

const userSchema = new Schema({
  username: {
    required: [true, 'Required Username.'],
    type: String,
    unique: true,
  },
  password: {
    type: String,
  },
})

module.exports = model('User', userSchema)
