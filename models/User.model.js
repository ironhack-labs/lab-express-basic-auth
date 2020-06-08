// User model here
const {
    Schema,
    model
} = require('mongoose');

const userSchema = new Schema({
    username: {
        type: String,
        trim: true,
        required: [true, 'Username is required.'],
        unique: true
    },
    email: {
        type: String,
        trim: true,
        required: [true, 'Email is required.'],
        lowercase: true,
        unique: true,
        match: [/^\S+@\S+\.\S+$/, 'Dirección de correo inválida.']
    },
    passwordHash: {
        type: String,
        required: [true, 'Password is required.'],
    }
    // add password property here
}, {
    timestamps: true
});

module.exports = model('User', userSchema);