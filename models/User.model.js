// User model here
const mongoose = require ('mongoose')
const {Schema, model} = require('mongoose');

const userSchema = new Schema(
    {
    username: {
        type: String,
        trim: true,
        required: [true, 'Username is a required field'],
        unique: true
    },
    email: {
        type: String,
        required: [true, 'Email is a required field'],
        match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address.'],
        unique: true, 
        lowercase: true,
        trim: true
    },
    passwordHash: {
        type: String,
        required: [true, 'Password is a required field']
    }
    },
    {
        timestamps: true
    }
);

const User = model('User', userSchema);
module.exports = User;