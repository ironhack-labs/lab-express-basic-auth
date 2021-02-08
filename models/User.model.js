const mongoose = require('mongoose')
const bcrypt = require('bcrypt') // se hashea antes de que se guarde en la bd, por eso se hace en el modelo
/* const { use } = require('../configs/routes/user.routes') */
const EMAIL_PATTERN = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
const PASSWORD_PATTERN = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/
const SALT_FACTOR = 10

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Email is required'],
        // unique: true, -> not work, validator on controller
        trim: true,
        lowercase: true,
        match: [EMAIL_PATTERN, 'Provide a valid email']
    },
   /*  username: { // poner que no sea pattrern de email 
        type: String,
        required: [true, 'Username is required'],
        // unique: true, -> not work, validator on controller
    }, */
    password: {
        type: String,
        required: [true, 'Password is required'],
        match: [PASSWORD_PATTERN, 'Password must contain 8 characters, one lowercase, one capital letter and one number']
    }
})

userSchema.methods.checkPassword = function(passwordIn) {
    return bcrypt.compare(passwordIn, this.password) // es una promesa que devuelve un boolean, si no la soluciono aquí, si la quiero usar hay que resolver la promesa
}

userSchema.pre('save', function(next) {
    
    if(this.isModified('password')) {
        bcrypt.hash(this.password, SALT_FACTOR)
        .then(hashedPass => {
            this.password = hashedPass
            next()
        })
    } else {
        next()
    }
})


const User = mongoose.model('User', userSchema)
module.exports = User