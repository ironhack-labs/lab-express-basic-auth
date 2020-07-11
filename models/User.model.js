// User model here
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type:String,
        required: [true, 'User name is required']
    },
    password: {
        type:String,
        required: [true, 'Password is required'],
        minlength: [8, 'Password must be longer than 8 characters']
    }
});

userSchema.pre('save', function(next) {
    if (this.isModified('password')){
    bcrypt.hash(this.password, 10)
        .then (hash => {
            this.password = hash
            next()
        })
        .catch(error => next(error))
    } else {
        next()
    }
})

const User = mongoose.model('User', userSchema);

module.exports = User;