const mongoose = require("mongoose")
const Schema = mongoose.Schema
const userSchema = new Schema({
    user: {type: String, required: true, unique: true},
    password: String
}, { timestamps: true });

const User = mongoose.model("User", userSchema)

module.exports = User