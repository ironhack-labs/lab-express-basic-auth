const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(10);
const hash = bcrypt.hashSync("B4c0/\/", salt);

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    }
})


userSchema.pre("save", function(next) {
    if (this.isModified('password')) {
        bcrypt.hash(this.password, 10)
            .then(hash => {
                this.password = hash;
                next()
            })
    } else {
        next();
    }
});

userSchema.methods.checkPassword = function(password) {
    return bcrypt.compare(password, this.password)
}

const User = mongoose.model('User', userSchema);

module.exports = User;


