const bcrypt = require("bcrypt");
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
    },
    password: {
        type: String,

    }
});

userSchema.pre('save', function(next) {
    if (this.isModified('password')) {
        bcrypt.hash(this.password, 10).then((hash) => {
            this.password = hash;
            next();
        });
    } else {
        next();
    }
})

userSchema.methods.checkPassword = function(password) {
    return bcrypt.compare(password, this.password);
}

const User = mongoose.model("User", userSchema);

module.exports = User;