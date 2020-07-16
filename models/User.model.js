// User model here

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcryptjs');

const userSchema = new Schema(
    {
        user: {
            type: String,
            require: [true, "User is required"],
            trim: true,
            unique: true,
            // match: '',
            //   Expresión regular de que tiene que ser la cadena ej: email
            //   /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        },
        password: {
            type: String,
            minlenght: [8, "Password needs at last 8 chars"]
        }
    });


// Comparar la contraseña para validarla
userSchema.methods.checkPass = function (pass) {
    return bcrypt.compare(pass, this.password)
}

// Guardar la contraseña cifrada
userSchema.pre('save', function (next) {
    if (this.isModified('password')) {
        bcrypt.hash(this.password, 10)
            .then((hash) => {
                this.password = hash;
                next();
            });
    } else {
        next();
    }
})


const User = mongoose.model('User', userSchema)

module.exports = User