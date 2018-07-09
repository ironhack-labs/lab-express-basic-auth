
const userSchema = new require('mongoose').Schema({
    username: String,
    password: String
})

module.exports = require('mongoose').model('User', userSchema);