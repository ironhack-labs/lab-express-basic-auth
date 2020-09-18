// routes/auth.routes.js

const { Router } = require('express');
const router = new Router();
const bcryptjs = require('bcryptjs');
const saltRounds = 10;
const User = require('../models/User.model');
const mongoose = require('mongoose');

////////////////////////////////////////////////////////////////////////
///////////////////////////// SIGNUP //////////////////////////////////
////////////////////////////////////////////////////////////////////////

// .get() route ==> to display the signup form to users
router.get('/signup', (req, res) => res.render('auth/signup'));

// .post() route ==> to process form data
router.post('/signup', (req, res, next) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        res.render('auth/signup', { errorMessage: 'All fields are mandatory. Please provide your username, email and password.' });
        return;
    }

    // make sure passwords are strong:
    const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    if (!regex.test(password)) {
        res
            .status(500)
            .render('auth/signup', { errorMessage: 'Password needs to have at least 6 chars and must contain at least one number, one lowercase and one uppercase letter.' });
        return;
    }

    bcryptjs
        .genSalt(saltRounds)
        .then(salt => bcryptjs.hash(password, salt))
        .then(hashedPassword => {
            return User.create({
                // username: username
                username,
                email,
                // passwordHash => this is the key from the User model
                //     ^
                //     |            |--> this is placeholder (how we named returning value from the previous method (.hash()))
                passwordHash: hashedPassword
            });
        })
        .then(userFromDB => {
            console.log('Newly created user is: ', userFromDB);
            res.redirect('/userProfile');
        })
        .catch(error => {
            if (error instanceof mongoose.Error.ValidationError) {
                res.status(500).render('auth/signup', { errorMessage: error.message });
            } else if (error.code === 11000) {
                res.status(500).render('auth/signup', {
                    errorMessage: 'Username and email need to be unique. Either username or email is already used.'
                });
            } else {
                next(error);
            }
        }); // close .catch()
});

////////////////////////////////////////////////////////////////////////
///////////////////////////// LOGIN ////////////////////////////////////
////////////////////////////////////////////////////////////////////////

// .get() route ==> to display the login form to users
router.get('/login', (req, res) => res.render('auth/login'));

// .post() login route ==> to process form data
router.post('/login', (req, res, next) => {
    // console.log('SESSION =====> ', req.session);
    const { email, password } = req.body;

    if (email === '' || password === '') {
        res.render('auth/login', {
            errorMessage: 'Please enter both, email and password to login.'
        });
        return;
    }

    User.findOne({ email })
        .then(user => {
            if (!user) {
                res.render('auth/login', { errorMessage: 'Email is not registered. Try with other email.' });
                return;
            }
            bcryptjs
                .compare(password, user.passwordHash)
                .then(success => {
                    if (success) {
                        //******* SAVE THE USER IN THE SESSION ********//
                        req.session.currentUser = user;
                        return res.redirect('/userProfile');
                    }
                    res.render('auth/login', { errorMessage: 'Incorrect password.' });
                })
                .catch(err => {
                    throw new Error(err);
                });
        })
        .catch(error => next(error));
});

////////////////////////////////////////////////////////////////////////
///////////////////////////// LOGOUT ////////////////////////////////////
////////////////////////////////////////////////////////////////////////

router.post('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});
// router.get('/userProfile', (req, res) => res.render('users/user-profile'));

// Protegendo rota privada
router.get('/userProfile', (req, res) => {
    console.log('your sess exp: ', req.session.cookie.expires);
    if (req.session.currentUser) {
        return res.render('users/user-profile', { userInSession: req.session.currentUser });
    }

    res.redirect('/login');
    // res.render('users/user-profile', { userInSession: req.session.currentUser });
});

module.exports = router;