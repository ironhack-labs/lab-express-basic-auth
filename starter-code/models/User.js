let mongoose = require('mongoose')
let Schema = mongoose.Schema

let userSchema = new Schema({
  username:{
    type:String,
    required:true,
    unique:true
  },
  password:{
    type:String,
    required:true
  }
},{timestamps:true})

module.exports = mongoose.model('User',userSchema)