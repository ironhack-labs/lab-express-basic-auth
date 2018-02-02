const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username:String,
    password:String,
},{
    timestamps:{
        cratedAt:"created_at",
        updatedsAt:"updates_at"
    }
});

const User = mongoose.model('User',userSchema);
module.exports = User;