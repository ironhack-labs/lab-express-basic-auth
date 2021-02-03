const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const EMAIL_PATTERN = /^(([^<>()[\]\\.,;:\s@']+(\.[^<>()[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const PASSWORD_PATTERN = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;
const SALT_ROUNDS = 11

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: 'Es necesario que introduzcas un correo electrónico',
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: 'La contraseña es requerida',
        unique: true,
    }
})
userSchema.pre('save', function(next) {
    //user es igual a this

    if (this.isModified('password')) {
        bcrypt.hash(this.password, SALT_ROUNDS)
            .then(hash => {
                this.password = hash
                next()
            })
    } else {
        next()
    }
})
const User = mongoose.model('User', userSchema)
module.exports = User;