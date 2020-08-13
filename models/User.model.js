// User model here

const { Schema, model } = require('mongoose');

const userSchema = new Schema (
    {
        username: {
            type: String,
            trim: true,
            required: [true, 'you need to pass an unique username!'],
            unique: true
        },
        email: {
            type: String,
            required: [true, 'an email is mandatory'],
            match: [/^\S+@\S+\.\S+$/, 'needs to be a valid email'],
            unique: true,
            trim: true,
            lowercase: true
        },
        passwordHash: {
            type: String,
            required: [true, 'Password is required!']
        },
    },
    {
        timestamps: true
    }
)

module.exports = model('User', userSchema)