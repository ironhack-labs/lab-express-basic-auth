const express = require('express');
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");

// ! GET PAGES

// GET signup page
router.get("/signup", (req, res, next) => {
    // Render `views/signup.hbs`
    res.render("signup");
});

// GET login page
router.get("/login", (req, res, next) => {
    // Render `views/login.hbs`
    res.render("login");
});

// GET private page
router.get("/private", (req, res, next) => {
    // Render `views/private.hbs`
    res.render("private");
});


// ! User Signup/Login

// User signup
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
        .then(user => {
            // console.log(userInput);

            // If user exists in the database
            if(user !== null) {
                // Re-render `signup.hbs` with error message
                res.render("signup", { message: `The username can't be repeated.`});
            } else {
                // Generate salt with middleware bcrypt
                const salt = bcrypt.genSaltSync();
                // Merge plaintext password with salt and convert to hash password
                const hash = bcrypt.hashSync(password, salt);

                // Create new user with given params username + password
                User.create({
                    username: username,
                    password: hash
                })
                .then((dbUser) => {
                    req.session.user = dbUser;
                    res.redirect("/");
                })
                .catch(err => next(err));
            }
        })
        .catch(err => next(err));
});

// User login
router.post("/login", (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;

    if(username === "" || password === "") {
        res.render("login", { message: `Please provide a username and a password.`});
    }

    User.findOne({ username: username })
        .then(user => {
            if (!user) {
                res.render("login", {
                    message: "Invalid credentials"
                });
                return;
            }
            if (bcrypt.compareSync(password, user.password)) {
                req.session.user = user;

                res.redirect("/private");
            } else {
                res.render("login", {
                    message: "Invalid credentials"
                });
                return;
            }
        })
        .catch(err => next(err));
});

router.get((req, res, next) => {
    if(req.session.user) {
        next();
    } else {
        res.redirect("/login");
    }
})

router.get("/logout", (req, res, next) => {
    req.session.destroy(err => {
        if (err) next(err);
        else res.redirect("/");
    });
});

module.exports = router;