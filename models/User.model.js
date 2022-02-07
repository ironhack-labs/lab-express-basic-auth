const { Schema, model } = require("mongoose")

const userSchema = new Schema(
{
    username: {
        minlength: [4, 'The username must have a minimum of 4 characters'],
        type: String,
        trim: true,
        required: [true, 'Indicate the username'],
        unique: true
},
    email: {
        type: String,
        required: [true, 'Indicate the email'],
        unique: true,
        lowercase: true,
        trim: true
    },
    passwordHash: {
        type: String,
        required: [true, 'Indicate the password']
    }
},
{
      timestamps: true
})

const User = model("User", userSchema)
module.exports = User