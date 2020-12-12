// User model here
const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: {
        type: String, 
        trim: true,
        unique: true, 
        required: [true, 'Username is required'],
    }, 
    password: {
        type: String, 
        required: true, 
    }
})

module.exports = mongoose.model("User", userSchema)