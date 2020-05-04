const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// --- iteration 1 ---
const userSchema = new Schema({
    username: String,
    password: String,
})

const User = mongoose.model('User', userSchema)

module.exports = User;