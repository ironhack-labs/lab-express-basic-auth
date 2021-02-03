const mongoose = require('mongoose');
const bcrypt = require('bcrypt')
const SALT_ROUNDS = 10

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: 'Es necesario introducir un nombre'
    },
    username: {
        type: String,
        unique: true,
        trim: true,
        lowercase: true,
        required: 'Es necesario introducir un nombre de usuario'
    },
    password: {
        type: String,
        trim: true,
        required: 'Es necesario introducir una contraseña'
    }
})

userSchema.pre('save', function(next) {
    if(this.isModified('password')){
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
module.exports = User