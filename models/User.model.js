// User model here
const { Schema, model } = require('mongoose');

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: [true, 'Username is required.'],
            unique: true,
            lowercase: true,
            trim: true
        },
        email: {
            type: String,
            required: [true, 'Email is required.'],
            match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address.'],
            unique: true,
            lowercase: true,
            trim: true
        },
        password: {
            type: String,
            required: [true, 'Password is required.']
        }
    },

    {
        timestamps: true
    }
);

module.exports = model('User', userSchema);
