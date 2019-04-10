const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const EMAIL_PATTERN = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i

const userSchema = new mongoose.Schema({
  email: {
    type:String,
    trim: true,
    match: [EMAIL_PATTERN,'Invalid email pattern'],
    required:[true, 'Email is required'],
    unique: true,
    tolowercase: true
  },
  password : {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password needs at last 8 chars']
  }
},{timestamps:true})

const User = mongoose.model('User',userSchema)
module.exports = User