const mongoose = require ('mongoose');

const userSchema = mongoose.Schema({
    username: {
        type: String,
        trim: true,
        required: [true, 'Username is required.'],
        unique: true,
    },
    password: {
        type: String,
        minLength: [8, 'The minimum length is 8.'],
        required: [true, 'Password is required.']
    }
},
{
    timestamps: true,
})

module.exports = mongoose.model('User', userSchema)