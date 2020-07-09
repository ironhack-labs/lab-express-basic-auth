// User model here
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const userSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    password :{
        type: String,
        minlength: 4,
        maxlength: 10
    } 
})

const User = mongoose.model('user', userSchema)

module.exports = User