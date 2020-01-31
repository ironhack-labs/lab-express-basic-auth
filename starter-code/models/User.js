const {Schema, model} = require('mongoose')

const userSchema = new Schema(
    {
        username: {
            unique: true,
            type: String
        },
        email: String,
        password: String
    },
    {
        timestamps: true,
        versionKey: false
    }
)

module.exports = model('User', userSchema)