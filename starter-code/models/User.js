let mongoose = require('mongoose')
let Schema = mongoose.Schema

let userSchema = new Schema({
username: {
  type: String,
  unique: true,
}, 
password: String,
},{timestamps:true})

module.exports = mongoose.model('User', userSchema) 