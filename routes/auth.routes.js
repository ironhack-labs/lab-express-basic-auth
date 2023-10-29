// routes/auth.routes.js
const mongoose = require('mongoose'); // <== has to be added
const { Router } = require('express');
const router = new Router();

// the setup code skipped
const bcryptjs = require('bcryptjs');
const saltRounds = 10;

const User = require("../models/User.model");

// require auth middleware
const { isLoggedIn, isLoggedOut } = require('../middleware/route-guard.js')

// GET route ==> to display the signup form to users
router.get('/auth/signup', isLoggedOut, (req, res) => res.render('auth/signup'));

// POST route ==> to process form data
//check is use already exists in the DB 
router.post('/auth/signup', isLoggedOut, (req, res, next) => {
    // console.log("The form data: ", req.body);

    const { username, password } = req.body;


    //make sure users fill all mandatory fields;
    if (!username || !password) {
        res.render('auth/signup', { errorMessage: 'All fields mandatory.Please provide your username,  email and password' });
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
        .then((salt) => bcryptjs.hash(password, salt))
        .then((hashedPassword) => {
            return User.create({
                username: username,
                password: hashedPassword
            });
        })
        .then(userFromDB => {
            //console.log('Newly created user is: ', userFromDB);
            res.redirect("/auth/login");
        })
        .catch(error => {
            // copy the following if-else statement
            if (error instanceof mongoose.Error.ValidationError) {
                res.status(500).render('auth/signup', { errorMessage: error.message });
            } else if (error.code === 11000) {

                console.log(" Username needs to be unique. Either username is already used. ");

                res.status(500).render('auth/signup', {
                    errorMessage: 'Username and email need to be unique. Either username or email is already used.'
                });
            } else {
                next(error);
            }
        })
});

// GET route ==> to display the login form to users
router.get('/auth/login', isLoggedOut, (req, res) => res.render('auth/login'));

// POST login route ==> to process form data
router.post('/auth/login', isLoggedOut, (req, res, next) => {
    console.log('SESSION =====> ', req.session);

    const { username, password } = req.body;

    if (username === '' || password === '') {
        res.render('auth/login', {
            errorMessage: 'Please enter both, username and password to login.'
        });
        return;
    }

    User.findOne({ username })
        .then(user => {
            if (!user) {
                console.log("User not registered. ");
                res.render('auth/login', { errorMessage: 'User not found and/or incorrect password.' });
                return;
            }
            // if user does not exist (undefined do short-circuit and return)

            // if user exists
            if (bcryptjs.compareSync(password, user.password)) {
                // when we introduce session, the following line gets replaced with what follows:
                // res.render('users/user-profile', { user });

                //******* SAVE THE USER IN THE SESSION ********//
                req.session.currentUser = user;
                res.redirect('/user/profile');
            } else {
                console.log("Incorrect password. ");
                res.render('auth/login', { errorMessage: 'User not found and/or incorrect password.' });
            }
        })
        .catch(error => next(error));
});

router.post('/auth/logout', isLoggedIn, (req, res, next) => {
    req.session.destroy(err => {
        if (err) {
            next(err);
            return
        }
        res.redirect('/');
    });
});



module.exports = router;
