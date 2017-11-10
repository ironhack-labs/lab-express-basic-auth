'use strict';

const express = require('express');
const router = express.Router();

// User model
const User = require('../models/user').User;

// BCrypt
const bcrypt = require('bcrypt');
const bcryptSalt = 10;

// --- Sign up --- //
router.get('/signup', function(req, res, next) {
    res.render('auth/signup');
});

// --- Redirect --- //
router.get('/registered', function(req, res, next) {
    res.render('auth/registered');
});

router.post('/signup', function(req, res, next) {
    const username = req.body.username;
    const password = req.body.password;
    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = User({
        username,
        password: hashPass
    });

    User.findOne({
        username: username
    }, (err, user) => {
        if (user) {
            res.render('auth/signup', {
                errorMsg: 'Username is taken'
            });
        } else {
            newUser.save((err) => {
                res.redirect('/auth/registered'); //'/auth/registered'
            });
        }

    });
});

// Welcome

router.get('/welcome', function(req, res, next) {
    console.log(req.session.currentUser);
    res.render('auth/welcome', {
        username: req.session.currentUser.username
    });
});

// --- Sign in --- //
router.get('/login', function(req, res, next) {
    res.render('auth/login');
});

router.post('/login', function(req, res, next) {
    const username = req.body.username;
    const password = req.body.password;

    if (username === "" || password === "") {
        res.render("auth/login", {
            errorMessage: "Indicate a username and a password to sign up"
        });
        return;
    }

    User.findOne({
        "username": username
    }, (err, user) => {
        if (err || !user) {
            res.render("auth/login", {
                errorMessage: "The username doesn't exist"
            });
            return;
        }
        if (bcrypt.compareSync(password, user.password)) {
            // Save the login in the session!
            req.session.currentUser = user;
            res.redirect("/auth/welcome");
            console.log(req.session);
            if (req.session);
        } else {
            res.render("auth/login", {
                errorMessage: "Incorrect password"
            });
        }
    });
});

// --- Protected Routes --- //
router.get('/main', function(req, res, next) {
    if (req.session.currentUser) {
        res.render('protected/main');
    } else {
        res.render('auth/login', {
            protected: "Can't touch this!"
        });
    }
});

router.get('/private', function(req, res, next) {
    if (req.session.currentUser) {
        res.render('protected/private');
    } else {
        res.render('auth/login', {
            protected: "Can't touch this!"
        });
    }
});

module.exports = router;
