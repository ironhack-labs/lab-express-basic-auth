// User model here
const mongoose = require('mongoose');
const { Schema, model, Types } = mongoose;

const User = model('User', new Schema({
    username: { type: String, required: true },
    email: { type: String, unique: true, required: true},
    password: { type: String, required: true, minLength: 6 }
}))

module.exports = User;