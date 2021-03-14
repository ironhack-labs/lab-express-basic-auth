// User model here

const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const UserSchema = new Schema({
    username : {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

const UserModel = mongoose.model('user', UserSchema);

module.exports = UserModel;