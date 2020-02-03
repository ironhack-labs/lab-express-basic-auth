const {model, Schema} = require('mongoose')

const userSchema = new Schema({
    name: {
        type: String,
        unique : true
    },
    email: {
        type: String
    },
    password: {
        type: String
    }

})

module.exports = model('User', userSchema)