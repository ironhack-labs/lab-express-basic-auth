const Schema = require('mongoose').Schema;

const userSchema = new Schema ({
    username: {
        type: String,
        unique: true
    },
    password: String,
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});

module.exports = require('mongoose'). model('User', userSchema);