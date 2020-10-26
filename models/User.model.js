// User model here
const mongoose = require('mongose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    mail: { type: String, require: true },
    password: { type: String, require: true }
});

const User = mongoose.model('User', userSchema);
module.exports = User;