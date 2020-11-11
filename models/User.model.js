const {
    Schema,
    model
} = require('mongoose');


const userSchema = new Schema({
    username: {
        type: String,
        unique: true,
        trim: true,
        required: [
            true,
            `username is required`
        ]
    },
    passwordHash: {
        type: String,
        required: [
            true,
            'password is required'
        ]
    }
}, {
    timestamps: true
});


module.exports = model('User', userSchema);