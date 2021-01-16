// User model here
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: [true, 'user name is required'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'password is required'],
        //match: /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/,
        //minlength: 8
    }
});

module.exports = mongoose.model('User', userSchema);