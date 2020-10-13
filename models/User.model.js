// User model here
const mongoose = require('mongoose')
const userSchema = new mongoose.Schema ({
    username: {
     type: String,
     unique: true,   
    },
    password: String,
})

// const UserModel = mongoose.model('user', userSchema)
module.exports = mongoose.model('user', userSchema)
