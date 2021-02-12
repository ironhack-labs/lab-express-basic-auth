// User model here
const { Schema, model } = require('mongoose')

const userSchema = new Schema({

    username: {
        type: String,
        trim: true,
        required: [true, 'Username is required'],
        unique: true
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address.'],
        required: [true, 'Email is required']
    },
    passwordHash: {
        type: String,
        required: [true, 'Password is required'],
    }

}, { timestamps: true })



module.exports = model('User', userSchema)