'use strict';

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

router.post('/login', (req, res, next) => {
    var username = req.body.username;
    var password = req.body.password;

    if (username === "" || password === "") {
        res.render("auth/login", {
            errorMessage: "Indicate a username and a password to sign up"
        });
        return;
    }

    User.findOne({ "username": username }, (err, user) => {
        if (err || !user) {
            res.render("auth/login", {
                errorMessage: "The username doesn't exist"
            });
            return;
        }
        if (bcrypt.compareSync(password, user.password)) {
            // Save the login in the session!
            req.session.currentUser = user;
            res.redirect("/auth/main");
        } else {
            res.render("auth/login", {
                errorMessage: "Incorrect password"
            });
        }
    });
});


//sign up

router.get('/signup', function (req, res, next) {
    res.render('auth/signup');
});

router.post('/signup', function (req, res, next) {
    var username = req.body.username;
    var password = req.body.password;
    var salt = bcrypt.genSaltSync(bcryptSalt);
    var hashPass = bcrypt.hashSync(password, salt);

    var newUser = User({
        username,
        password: hashPass
    });

    newUser.save((err) => {
        res.redirect("/");
    });
});

//Protected routes

router.get('/main', (req, res, next) => {
    const currentUser = req.session.currentUser;
    if (currentUser) {
        const data = {
            user: currentUser
        };
        res.render("auth/main", data);
    }
    else {
        res.redirect("/auth/login");
    }
});

router.get('/private', (req, res, next) => {
    const currentUser = req.session.currentUser;
    if (currentUser) {
        const data = {
            user: currentUser
        };
        res.render("auth/private", data);
    }
    else {
        res.redirect("/auth/login");
    }
});


module.exports = router;
