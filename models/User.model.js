const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: [true,'username is required'],
        unique: [true,'username must be unique'],
        minlength: [3,'username must be at least 3 characters long']
    },
    password: {
        type: String,
        required: [true,'password required'],
        minlength: [3, 'password must be at least 3 characters long']
    }
})

const User = mongoose.model('User',userSchema)
model.exports = User;

