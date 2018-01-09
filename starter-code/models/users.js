var mongoose = require('mongoose');

Schema = mongoose.Schema;

const userSchema = new Schema({
    username: String,
    password: String
})

const User = mongoose.model('User', userSchema);

module.exports = User;