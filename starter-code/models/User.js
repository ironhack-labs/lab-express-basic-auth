const mongoose = require('mongoose')
const Schema = mongoose.Schema

userSchema = new Schema({
  username:{
    type: String,
    required: true,
    unique: true
  },
  password:{
    type: String,
    required: true,
    unique: true
  }
})
module.exports=mongoose.model('User', userSchema)
