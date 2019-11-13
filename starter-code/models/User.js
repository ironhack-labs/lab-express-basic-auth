const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: String,
    password: String
});

const User = mongoose.model("basic-auth-user", userSchema);

module.exports = User;