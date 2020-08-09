// User model here
const mongoose = require("mongoose")
const { Schema, model } = mongoose;

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            unique: true
        },
        passwordHash: {
            type: String,
            required: true,
            trim: true
        }
    }
)

module.exports = model("User", userSchema)