const express = require('express');
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");

// GET signup page
router.get("/signup", (req, res, next) => {
    // Render `views/signup.hbs`
    res.render("signup");
});

router.post("/signup", (req, res, next) => {
    // Get username & password from user form input
    const username = req.body.username;
    const password = req.body.password;

     // Username or password can't be empty
    if (username === "" || password === "") {
        // Re-render `signup.hbs` with error message
        res.render("signup", { message: "The field(s) can't be empty." });
        return;
    }

    // Restrict password.length to minimum 8 chars
    if (password.length <= 8) {
        // Re-render `signup.hbs` with error message
        res.render("signup", { message: "Password can't be shorter than 8 chars." });
        return;
    }

    // Find user by given username in the database
    User.findOne({ username: username })
        .then(userInput => {
            // console.log(userInput);

            // If user exists in the database
            if(userInput !== null) {
                // Re-render `signup.hbs` with error message
                res.render("signup", { message: `The username can't be repeated.`})
            } else {
                // Generate salt with middleware bcrypt
                const salt = bcrypt.genSaltSync();
                // Merge plaintext password with salt and convert to hash password
                const hash = bcrypt.hashSync(password, salt);

                // Create new user with given params username + password
                User.create({ username: username, password: hash })
                    .then(() => res.redirect("/"))
                    .catch(err => next(err));
            }
        })
});

module.exports = router;