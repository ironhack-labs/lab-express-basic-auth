const {model, Schema} = require('mongoose') 

const userSchema = new Schema(
    {
        username: {
            type: String,
            unique: true,
            required: true
        },
        password:{
            type: String,
            unique: true,
            required: true
        }
    }
)

module.exports = model('User', userSchema)
