


const { Schema, model } = require("mongoose")

const userSchema = new Schema({
  username: {
    type: String,
    trim: true,
    required: [true, 'username is required'],
  },
  email: {
    type: String,
    required: [true, 'email is required'],
    unique: true,
    trim: true
  },

  password: {
    type: String,
    required: [true, 'password is required']

  },

  birthday: String,

  profession: String,
  experience: String,
  pet: String
})

const User = model("User", userSchema)

module.exports = User
