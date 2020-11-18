// User model here
const mongoose = require("mongoose");
const {Schema, model} = mongoose;

const userSchema = new Schema({
    username: {
        type: String,
        unique: true
    },
    password: String
})

const User = mongoose.model("User", userSchema);

module.exports = User;