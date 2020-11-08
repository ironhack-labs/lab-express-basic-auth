// User model here
// const { Schema, model } = require('mongoose');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const userSchema= new Schema({
        username: {
                type:String,
                required: true,
        },
        password: {
                type:String,
                required:true,
        }
        },
        {
                timestamps:true
        }
);
// module.exports = model('Movie', movieSchema);
const User = mongoose.model('User', userSchema);
module.exports = User;