// User model here

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userScheme = new Schema( {
    username: { type: String, unique: true},
    password: String
},
{
    timestamps: true
})

const User = mongoose.model('User', userScheme);

module.exports = User;

