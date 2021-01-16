// User model her
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const userSchema = new Schema ({ 
        username: {
            type: String,
            unique: true,
            required: 'Username is required'
        },
        password: {
            type: String,
            required: 'Username is required'
        }
}, {timestamps: true} );
const User = mongoose.model('User' , userSchema);
module.exports = User;
