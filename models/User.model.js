// User model here
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const PASSWORD_PATTERN = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{6,}$/;
const EMAIL_PATTERN = /^(([^<>()[\]\\.,;:\s@']+(\.[^<>()[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const SALT_ROUNDS = 10

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: 'Es necesario añadir un nombre de usuario',
            unique: true,
            trim: true
        },

        email: {
            type: String,
            required: 'Es necesario añadir un correo electrónico',
            unique: true,
            lowercase: true,
            match: [EMAIL_PATTERN, 'Email inválido'], 
            trim: true 
        },

        password: {
            type: String,
            required: 'La contraseña es requerida',
            match: [PASSWORD_PATTERN, 'Tu contraseña debe conteneral menos 1 número, 1 mayúscula, 1 minúscula y 6 caracteres']
        }

    }
)

userSchema.methods.checkPassword = function(passwordToCheck){
    return bcrypt.compare(passwordToCheck, this.password)
    
}

userSchema.pre('save', function(next){
    const user = this

    if(user.isModified('password')){
        bcrypt.hash(user.password, SALT_ROUNDS)
            .then(hash => {
            this.password = hash
            next()
            })
    }
})

const User = mongoose.model('User', userSchema)
module.exports = User;