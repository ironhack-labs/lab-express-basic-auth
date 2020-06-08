// Importing the npm packages and mongoose models needed
const express = require('express');
const bcryptjs = require('bcryptjs');
const User = require('../models/User.model');

// Variables needed for the routes and the hashing of the password
const router = express.Router();
const saltRounds = 10;

// Signup GET route
router.get('/signup', (req, res, next) => res.render('auth/signup'));

// Signup POST route
router.post('/signup', (req, res, next) => {
    // Creating the objects from the req.body to use in the route logic
    const {
        username,
        email,
        password
    } = req.body;

    // Treating the error (All fields must be filled)
    if (!username || !email || !password) {
        res.render('auth/signup', {
            errorMessage: 'All fields are mandatory. Please provide your username, email and password.'
        });
        return;
    }

    // Making sure that the user password is strong
    const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    // Handling the error (week password)
    if (!regex.test(password)) {
        res
            .status(400)
            .render('auth/signup', {
                errorMessage: 'Passwords need to have at least 6 characters and must contain at least one number, one lowercase and one uppercase letter.'
            });
        return;
    }
    // Hashing the password and then creating the user in the database
    bcryptjs.genSalt(saltRounds)
        .then(salt => bcryptjs.hash(password, salt))
        .then(hashedPassword => {
            return User.create({
                username,
                email,
                passwordHash: hashedPassword
            })
        })
        .then(user => {
            // Redirecting the users to their profiles
            res.redirect('/userProfile');
            console.log(`User created with success! ${user}`)
        })
        .catch(err => {
            if (err instanceof mongoose.Error.ValidationError) {
                // Handling the error if it's a mongoose validation error
                res.status(400).render('auth/signup', {
                    errorMessage: err.message
                });
            } else if (error.code === 11000) {
                // Handling the error if it's a MongoDB duplication error
                res.status(400).render('auth/signup', {
                    errorMessage: 'Username and email need to be unique. Either username or email is already used.'
                })
            } else {
                next(err);
            }
        })
})

// User profile GET route (using session to send information)
router.get('/userProfile', (req, res) => {
    res.render('users/user-profile', { userInSession: req.session.currentUser });
});

// Login GET route
router.get('/login', (req, res) => res.render('auth/login'));

// Login POST route
router.post('/login', (req, res, next) => {
    // Checking the session 
    console.log('SESSION =====> ', req.session);

    // Creating the objects from the req.body to use in the route logic
    const {
        email,
        password
    } = req.body;

    // Handling the error (if the fields are empty, throw error)
    if (email === '' || password === '') {
        res.render('auth/login', {
            errorMessage: 'Please enter both, email and password to login.'
        });
        return;
    };

    // Checking if the user using the email
    User.findOne({
            email
        })
        .then(user => {
            // Handling the error (if the email is not registered)
            if (!user) {
                res.render('auth/login', {
                    errorMessage: 'Email is not registered. Try with other email.'
                });
                return;
                // Comparing the password introduced by the user with the hashed password in the database
            } else if (bcryptjs.compareSync(password, user.passwordHash)) {
                // Redirecting the users to their profile if the password is correct using the session
                req.session.currentUser = user;
                res.redirect('/userProfile');
            } else {
                // Handling the error (if the password doesn't match the one in the database)
                res.render('auth/login', {
                    errorMessage: 'Incorrect password.'
                });
            }
        })
        .catch(error => next(error));
});

// Logout route to destroy the session (desconect the user and redirect it to the home page)
router.post('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
  });

module.exports = router;