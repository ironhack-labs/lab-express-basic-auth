const mongoose = require('mongoose');

const Schema = mongoose.Schema

const userSchema = new Schema({
    user: {
        type: String, 
        require: true,
        default: 'Julian'
    },
    password: {
        type: String, 
        require: true
    }
},

{   timestamps: true   
})

const User = mongoose.model('User', userSchema)

module.exports = User