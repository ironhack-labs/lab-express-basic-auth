// User model here
const mongoose = require("mongoose");
/* const bcrypt = require('bcrypt') */
const EMAIL_PATTERN = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
/* const PASSWORD_PATTERN = /^[A-Za-z]\w{7,14}$/ */
/* const SALT_ROUNDS = 10 */

const { Schema, model } = require('mongoose');


const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Email is required.'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [EMAIL_PATTERN, 'Invalid email']
    },
    passwordHash: {
        type: String,
        required: [true, 'Password is required.'],
/*         match: [PASSWORD_PATTERN, 'Password needs 1 digit, 1 uppercase, 1 lowecase and 8 characters ']
 */    }
});
module.exports = model('User', userSchema);