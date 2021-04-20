// User model here
const {Schema, model} = require('mongoose');

const userSchema = new Schema({
     username: {
         type: String,
        //  trim: true,
        //  required: [true, 'Username is required'],
         unique: true
     },
     email: {
         type: String,
         unique: true,
     },
     password: {
         type: String,
     }
});

const User = model ("User", userSchema);

module.exports = User;
