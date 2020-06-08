// User model here
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: [true, 'Username is required.'],
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required.'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Dirección de correo inválida.']
    },
    passwordHash: {
        type: String,
        required: [true, 'Password is required.']
    }
});

const User = mongoose.model('User', userSchema);
module.exports = User;