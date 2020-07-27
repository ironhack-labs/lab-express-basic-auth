// User model here

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: String,
    password: String
}, {
    timestamps: true //Pour avoir date/heure de la création
});

const User = mongoose.model('User', userSchema);
module.exports = User;