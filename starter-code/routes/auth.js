const express = require('express');
const router = express.Router();

const User = require("../models/user");

const bcrypt = require("bcrypt");
const bcryptSalt = 10;
const salt = bcrypt.genSaltSync(bcryptSalt);

/* GET sign up page */
router.get('/signup', (req, res, next) => {
    res.render('auth/signup.hbs');
});

router.post("/signup", (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;

    if (username === "" || password === "") {
        res.render("auth/signup", {
            errorMessage: "Indicate a username and a password to sign up"
        });
        return;
    }

    User.findOne({
            "username": username
        })
        .then(user => {
            if (user !== null) {
                res.render("auth/signup", {
                    errorMessage: "The username already exists!"
                });
                return;
            }

            const hashPass = bcrypt.hashSync(password, salt);

            User.create({
                    username,
                    password: hashPass
                })
                .then(() => {
                    res.redirect("/login");
                })
                .catch(error => {
                    console.log(error);
                })
        })
        .catch(error => {
            next(error);
        })
});

router.get('/login', (req, res, next) => {
    res.render('auth/login.hbs');
});

router.post("/login", (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;
    
    const hashPass = bcrypt.hashSync(password, salt);

    if (username === "" || password === "") {
        res.render("auth/login", {
            errorMessage: "Indicate a username and a password to log in"
        });
        return;
    }

    User.findOne({
            "username": username
        })
        .then(user => {
            if (user == null) {
                res.render("auth/login", {
                    errorMessage: "Invalid Credentials"
                })
                return;
            } else if (!bcrypt.compareSync(password, user.password)) {
                console.log(hashPass)
                res.render("auth/login", {
                    errorMessage: "Invalid Credentials"
                });
                return;
            } else {
                req.session.currentUser = user
                res.redirect("/")
            }

        })
        .catch(error => {
            next(error);
        })
});

module.exports = router;