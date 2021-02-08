const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const EMAIL_PATTERN = /^(([^<>()[\]\\.,;:\s@']+(\.[^<>()[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const PASSWORD_PATTERN = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;
const SALT_ROUNDS = 10;

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: [true, 'Username is required'],
        unique: true,
        lowercase: true,
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        match: [EMAIL_PATTERN, 'Please, enter a valid email format'],
        lowercase: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        //match: [PASSWORD_PATTERN, 'Your password must contain at least 1 number, 1 upper case letter, 1 lower case letter and be at least 8 characters long.']
    }
})

userSchema.methods.checkPassword = function (passwordToCheck) {
    return bcrypt.compare(passwordToCheck, this.password)
}

userSchema.pre('save', function(next) {
    const user = this;

    if (user.isModified('password')) {
        bcrypt.hash(user.password, SALT_ROUNDS)
            .then(hash => {
                this.password = hash;
                next();
            })
    } else {
        next();
    }
})

const User = mongoose.model('User', userSchema)
module.exports = User;