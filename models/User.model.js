const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = new Schema({
    username: {
        type: String,
        trim: true,
        required: [true, 'Username is required.'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Password is required.']
    },
    email: {
        type: String,
        required: [true, 'Email is required.'],
        match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address.'],
        unique: true,
        lowercase: true,
        trim: true
    },
});

userSchema.methods.toJSON = function() {
    const { password, ...data } = this.toObject();
    return data;
}
module.exports = model("User", userSchema);