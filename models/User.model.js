// User model here
const mongoose = require('mongoose')
const bcryptjs = require('bcryptjs');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: 'Username is required',
        trim: true,
        unique: true

    },
    password: {
        type: String,
        required: 'Password is required',
        minlength: 6,
    }
});


userSchema.pre('save', function (next) {
bcryptjs.hash(this.password, 10)
    .then(passHash => {
        console.log(passHash);
        this.password = passHash;
        next();
    })
    .catch(next);
});

userSchema.methods.checkPassword = function(passwordToCheck) {
    return bcryptjs.compare(passwordToCheck, this.password);
}


const User = mongoose.model('User', userSchema);
module.exports = User;