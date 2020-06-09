// User model here -> Requiring mongoose and defining the Schema variable
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// User model schema
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
        // Regular expresion to check if the email is valid and stablishing the error message
        match: [/^\S+@\S+\.\S+$/, 'Dirección de correo inválida.']
    },
    passwordHash: {
        type: String,
        required: [true, 'Password is required.']
    }
});

// Creating the User and exporting it
const User = mongoose.model('User', userSchema);
module.exports = User;