var express = require('express');
var router = express.Router();

// User model
const User = require("../models/user").User;

// BCrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

/* GET users listing. */
router.get('/login', function (req, res, next) {
    res.render('auth/login');
});

router.post('/login', function (req, res, next) {
    var username = req.body.username;
    var password = req.body.password;

    if (username === "" || password === "") {
        res.render("auth/login", {
            errorMessage: "Indicate a username and a password to log in"
        });
        return;
    }

    User.findOne({
        "username": username
    }, (err, user) => {
        if (err || !user) {
            res.render("auth/login", {
                errorMessage: "The username or password are invalid"
            });
            return;
        }
        if (bcrypt.compareSync(password, user.password)) {
            // Save the login in the session!
            req.session.currentUser = user;
            res.redirect("/");
        } else {
            res.render("auth/login", {
                errorMessage: "The username or password are invalid"
            });
        }
    });
});

router.get('/signup', function (req, res, next) {
    res.render('auth/signup');
});

router.post('/signup', function (req, res, next) {
    var username = req.body.username;
    var password = req.body.password;
    if (username === "" || password === "") {
        res.render("auth/signup", {
            errorMessage: "Indicate a username and a password to sign up"
        });
        return;
    }

    User.findOne({
            "username": username
        },
        "username",
        (err, user) => {
            if (user !== null) {
                res.render("auth/signup", {
                    errorMessage: "The username already exists"
                });
                return;
            }

            var salt = bcrypt.genSaltSync(bcryptSalt);
            var hashPass = bcrypt.hashSync(password, salt);

            var newUser = User({
                username: username,
                password: hashPass
            });
            newUser.save((err) => {
                if (err) {
                    next(err);
                }
                res.redirect("/");
            });
        });
});

module.exports = router;