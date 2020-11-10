const mongoose = require('mongoose');
const { Schema, model } = mongoose;


const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true
        },

        passwordHash: {
            type: String,
            required: true
        }

    },
    {
        timestamps: true
    }
);

module.exports = model('User', userSchema);