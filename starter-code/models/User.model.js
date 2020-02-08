const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema(
    {
        username: {
            type: String,
            unique: true,
            required: [true, 'Username is required!'],
            trim: true
        },
        email: {
            type: String,
            required: [true, 'Email is required!'],
            match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address.'],
            unique: true,
            lowercase: true,
            trim: true
        },
        passwordHash: {
            type: String,
            required: [true, 'Password is required!']
        }
    },
    {
        timestamps: true
    }
);

const User = mongoose.model('User', userSchema);

module.exports = User;