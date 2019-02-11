let mongoose = require('mongoose')
let Schema = mongoose.Schema

let userSchema = new Schema({
    username : {
        required: true,
        type: String
    },
    password: {
        required: true,
        type: String
    },
},{timestamps:true});

module.exports = mongoose.model('User', userSchema)