// User model here
const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const userSchema = new Schema(
    {
        username: {
            type: String,
            trim: true,
            required: [true, 'Username is required.'],
            unique: true,
            match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address.'],
            lowercase: true,
        },
        passwordHash: {
            type: String,
            required: [true, 'Password is required.']
        }
    },
    {
        timestamps: true
    }
);

module.exports = model('User', userSchema);