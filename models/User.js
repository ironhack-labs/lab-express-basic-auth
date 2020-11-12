// User model here User.model.js

const mongoose = require('mongoose');
const {Schema, model} = mongoose;

const userSchema = new Schema(
    {
        username: {
            type: String,
            trim: true,
            required: [true, 'Username is required.'],
            unique: true
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