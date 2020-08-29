// User model here

const { Schema, model } = require("mongoose")

const userSchema = new Schema(
    {
        username: {
            type: String,
            trim: true,
            required: [true, "Please provide a username"],
            unique: true
        },
        password: {
            type: String,
            required: [true, "Please provide a password"]
        }
    },
    {
        timestamps: true
    }
)

module.exports = model("User", userSchema)
