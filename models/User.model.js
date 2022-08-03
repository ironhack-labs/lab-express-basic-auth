const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const EMAIL_PATTERN =
  /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
const PASSWORD_PATTERN = /^.{8,}$/i;
const SALT_ROUNDS = 10;

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        requiered: [true, 'Name is requiered'],
        minLength: 5,
    },
    email: {
        type: String,
        unique: true,
        requiered: [true, 'Email is requiered'],
        match: [EMAIL_PATTERN, 'Email pattern dose not match'],
    },
    password: {
        type: String,
        requiered: [true, 'Password is requiered'],
        match: [PASSWORD_PATTERN, 'Password must containe 8 characters'],
    },
});

userSchema.pre('save', function(next) {
    const user = this;

    if(user.isModified('password')) {
        bcrypt
            .hash(user.password, SALT_ROUNDS)
            .then(hash => {
                user.password = hash;
                next();
            })
            .catch(err => {
                next(err);
            })
    } else {
        next();
    }
});

userSchema.methods.checkPassword = function (password) {
    const user = this;
    return bcrypt.compare(password, user.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;