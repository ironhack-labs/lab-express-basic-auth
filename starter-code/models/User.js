const mongoose = require('mongoose')

const UserModel = mongoose.model('users', {
    username:String,
    password:String
})

module.exports = UserModel