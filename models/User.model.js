// User model here
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const dbConnection = require("../configs/db.config")

const userSchema = new Schema({
    username: String,
    password: String
});

const User = mongoose.model("User", userSchema);

module.exports = User;