const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userModel = new Schema({
    userName:{
        type:String,
        uniqie: true,
        required: true,
    },
    encryptedPassword:{
        type:String,
        required: true,
    }
},{
    timestamps:true,
});

const User = mongoose.model('User', userModel);
module.exports = User;