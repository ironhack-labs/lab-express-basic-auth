// User model here
const mongoose = require("mongoose");
const bcrypt = require("bcrypt")

const EMAIL_PATTERN = /^(([^<>()[\]\\.,;:\s@']+(\.[^<>()[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const PASSWORD_PATTERN = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;
const SALT_ROUNDS = 10;

const userSchema = new mongoose.Schema({

    email: {
        type: String,
        required: "Email address is required",
        lowercase: true,
        match: [EMAIL_PATTERN, "Enter a valid email address"],
        trim: true
    },

    password: {
        type: String,
        required: "Password is required",
        match: [PASSWORD_PATTERN, "Your password must contain at least 1 number, 1 uppercase, 1 lowercase and 8 characters."]
    }

})

const User = mongoose.model("User", userSchema);

module.exports =  User;