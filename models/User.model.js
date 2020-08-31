// User model here
const { Schema, model } = require("mongoose")

const userSchema = new Schema({
    username: {
        type: String,
        trim: true,
        unique: true,
        required: [true, "Username is required"]
    },
    password: {
        type: String,
        trim: true,
        required: [true, "Password is requiresd"],
    }
}, 
    {
        timestamps: true
    }
)

module.exports = model("User", userSchema)