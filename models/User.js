const Schema = require('mongoose').Schema;

const userSchema = new Schema({
    username: {
        type: String,
        unique: true,
        // required: true
    },
    email: String,
    password: String,
    // required: true
});

module.exports = require('mongoose').model('User', userSchema);