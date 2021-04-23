// User model here
const mongoose = require('mongoose');
const {Schema, model} = mongoose;

const userSchema = new Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true
    },
    email: {
        type: String,
        required: [true, 'Username is required'],
        unique: true,
        lowercase: true,
        trim: true
    },
    passwordHash: {
        type: String,
        required: [true, 'Password is required']
    }
},
    {   
        timestamps: true
    }
);

const Users = mongoose.model ('Users', userSchema);

module.exports = Users;