// User model here
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    username: {type:String, unique:[true, 'Username has to be Unique']},
    password: {type:String, unique:[true, 'Password has to be Unique']},
})

const User = mongoose.model('user', userSchema)
module.exports = User;