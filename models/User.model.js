// User model here
const { Schema, model } = require('mongoose');

const userSchema = new Schema(
    {
        username: {
            type: String,
            trim: true,
            required: [true, 'Username is required.'],
            unique: true
        },
        passwordHash: {
            type: String,
            required: [true, 'password is required']
        }
    },
    {
    timestamps: true
    }
)

module.exports = model('User', userSchema)