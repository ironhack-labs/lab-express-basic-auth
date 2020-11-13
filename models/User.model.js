// User model here
const { Schema, model } = require("mongoose");

const userSchema = new Schema({
    username: { type: String, unique: true, required: true },
    // password: { type: String, required: true },
    passwordHash: { type: String, required: [true, "Password is required."] },

})

module.exports = model("User", userSchema);