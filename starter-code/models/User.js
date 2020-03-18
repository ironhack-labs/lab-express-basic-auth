const mongoose = require("mongoose");

module.exports = mongoose.model("users", {
    username: String,
    password: String
})