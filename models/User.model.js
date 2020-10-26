// User model here
const mongoose = require('mongoose')
 const userSchema = new mongoose.Schema ({
     email: {type: String, unique: true, require: true},
     password: {type: String, require: true},
 })

 
 // const User = mongoose.model('user', userSchema)
 module.exports = mongoose.model('user', userSchema)