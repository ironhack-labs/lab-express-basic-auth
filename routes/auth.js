// Requiring what we need, and setting saltRounds

const router = require('express').Router();

const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const saltRounds = 10;

const User = require('../models/User.model');

// Middleware goes here

const isLoggedOut = require('../middleware/isLoggedOut');
const isLoggedIn = require('../middleware/isLoggedIn');

router.get('/signup', isLoggedOut, (req, res, next) => {
    res.render('auth/signup');
});

router.post('/signup', isLoggedOut, (req, res, next) => {
    const { username, password } = req.body;

    if (!username) {
        return res
            .status(400)
            .render('auth/signup', { errorMessage: "Please provide your username." });
    }

    if (password.length < 8) {
        return res.status(400).render('auth/signup', { 
            errorMessage: "Your password needs to be at least 8 characters long." 
        });
    }

    // Search the database for a user with this username
    User.findOne({ username })
        .then((found) => {
            // if found, send error message that the name is already taken
            if (found) {
                return res.status(400)
                    .render('auth/signup', { errorMessage: "Username already taken." });
            }

            // if user is NOT found, create a new user - first by hashing the password
            return bcrypt
                .genSalt(saltRounds)
                .then((salt) => bcrypt.hash(password, salt))
                .then((hashedPassword) => {
                    // Create a user and save it in the database
                    return User.create({
                        username,
                        password: hashedPassword,
                    });
                })
                .then((user) => {
                    // then Bind the user to the session object
                    req.session.user = user;
                    res.redirect('/');
                })
                .catch((error) => {
                    if (error instanceof mongoose.Error.ValidationError) {
                        return res
                            .status(400)
                            .render('auth/signup', { 
                                errorMessage: error.message
                            });
                    }
                    if (error.code === 11000) {
                        return res.status(400).render('auth/signup', {
                            errorMessage: "Username needs to be unique - try a different username."
                        });
                    }
                    return res.status(500).render('auth/signup', {
                        errorMessage: error.message
                    });
                });
        });
});

module.exports = router;