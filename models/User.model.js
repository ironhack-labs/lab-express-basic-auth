// User model here
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const Schema = mongoose.Schema
const salt = 10

const userSchema = new Schema({
    username: {
        type: String,
        required: [true, "User name is required"]
    },
    password :{
        type: String,
        required: [true, "password is required"],
        minlength: [4,"min four characters, please"]
    
        }, 
    }, 
    { timestamps: true }
    );

userSchema.pre('save', function(next) {
    if (this.isModified('password')){
    bcrypt.hash(this.password, salt)
        .then (hash => {
            this.password = hash
            next()
        })
        .catch(error => next(error))
    } else {
        next()
    }
});

const User = mongoose.model('user', userSchema)

module.exports = User