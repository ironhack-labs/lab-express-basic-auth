const express = require('express');
const router = express.Router();

const User = require("../models/user");
// BCrypt to encrypt passwords
const bcrypt = require("bcryptjs");
const bcryptSalt = 10;

/* SignUp Page */
router.get('/signup', (req, res, next) => {
    res.render('auth/signup');
});

router.post("/signup", (req, res, next) => {
    // console.log("post: /signup");
    const username = req.body.username;
    const password = req.body.password;

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    if (username === "" || password === "") {
        res.render("auth/signup", {
            errorMessage: "Please enter Username and Password!"
        });
        return;
    }

    User.findOne({ "username": username })
        .then(user => {
            if (user !== null) {
                res.render("auth/signup", {
                    errorMessage: "The username already exists!"
                });
                return;
            }

            User.create({
                username,
                password: hashPass
            })
                .then(() => {
                    res.redirect("/");
                })
                .catch(error => {
                    console.log(error);
                })
        })
        .catch(error => {
            next(error);
        })
});

/* SignIn Page */
router.get('/signin', (req, res, next) => {
    res.render('auth/signin');
});

router.post("/signin", (req, res, next) => {
    const theUsername = req.body.username;
    const thePassword = req.body.password;
    if (theUsername === "" || thePassword === "") {
        res.render("auth/signin", {
            errorMessage: "Please enter both, username and password to sign in."
        });
        return;
    }

    User.findOne({ "username": theUsername })
        .then(user => {
            if (!user) {
                res.render("auth/signin", {
                    errorMessage: "The user doesn't exist."
                });
                return;
            }
            if (bcrypt.compareSync(thePassword, user.password)) {
                // Save the login in the session!
                req.session.currentUser = user;
                res.redirect("/");
            } else {
                res.render("auth/signin", {
                    errorMessage: "Incorrect password"
                });
            }
        })
        .catch(error => {
            next(error);
        })


});








module.exports = router;