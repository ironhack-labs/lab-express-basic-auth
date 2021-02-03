// User model here
const mongoose = require("mongoose")
const bcrypt = require('bcrypt')
const EMAIL_PATTERN = /^(([^<>()[\]\\.,;:\s@']+(\.[^<>()[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const PASSWORD_PATTERN = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;
const SALT_ROUNDS = 10

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: "Email is mandatory ",
        unique: true,
        lowercase: true,
        trim: true,
        match: [EMAIL_PATTERN, "Email invalid"]
    },
    password: {
        type: String,
        required: "Password is mandatory",
        match: [PASSWORD_PATTERN, "Your password must contain at least: 1 uppercase, 1 lowercase, 1 number and 8 characters"]
    }
})

userSchema.pre('save', function (next) {
    const user = this
    if (user.isModified('password')) {
        bcrypt.hash(user.password, SALT_ROUNDS)
            .then(hashPassword => {
                user.password = hashPassword
                next()
        })
    } else {
        next()
    }
})

const User = mongoose.model("User", userSchema)

module.exports = User