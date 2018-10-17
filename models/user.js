const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type:String,
        index: {unique: true}
    },
    password: String
});

const User = mongoose.model('User', userSchema);

module.exports = User;