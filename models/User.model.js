// User model here
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const Schema = mongoose.Schema

const userSchema = new Schema({
    username: {
        type: String,
        unique: true,
        required: true,
        minlength: 4,
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
    },
})

userSchema.pre('save', function(next) {
    bcrypt.hash(this.password, 10)
        .then ((hash) => {
            this.password = hash
            next()
        })
})

userSchema.methods.comparePassword = function (password) {
    return bcrypt.compare(password, this.password)
}

const User = mongoose.model('User', userSchema)

module.exports = User