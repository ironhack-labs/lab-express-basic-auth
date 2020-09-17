const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const userChema = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
}, { timestamps: true });

const User = model('user', userChema);

module.exports = User;
