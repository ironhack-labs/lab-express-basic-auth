const { Router } = require('express');
const router = new Router();
const mongoose = require('mongoose');
const User = require('../models/User.model');

// bcrypt
const bcryptjs = require('bcryptjs');
const saltRounds = 10;

router.get('/signup', (req, res, next) => {
    res.render('auth/signup');
});

router.post('/signup', (req, res, next) => {
    const { username, password } = req.body;
    const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;

    console.log(username, password);

    if (!(username || password)) {
        res.render('auth/signup', {
            errorMessage: 'Username and password are required!'
        });
    }

    if (!regex.test(password)) {
        res.render('auth/signup', {
            errorMessage: 'Your password should have 6 characters, 1 Uppercase and 1 diggit.'
        });
        return;
    }

    bcryptjs
        .genSalt(saltRounds)
        .then(salt => {
            return bcryptjs.hash(password, salt);
        })
        .then(hashedPassword => {
            return User.create({
                username,
                passwordHash: hashedPassword
            });
        })
        .then(userFromDB => {
            console.log(`The new user is: ${userFromDB}`);
        })
        .catch(error => {
            if (error instanceof mongoose.Error.ValidationError) {
                res.render('auth/signup', {
                    errorMessage: error.message
                });
            } else if (error.code === 11000) {
                res.render('auth/signup', {
                    errorMessage: 'Username has to be unique. Username already in use.'
                });
            }
        });
});


router.get('/login', (req, res, next) => {
    res.render('auth/login');
});

router.post('/login', (req, res, next) => {
    const { username, password } = req.body;


    if ((username || password) == '') {
        res.render('auth/login', {
            errorMessage: 'Please enter username and password to login.'
        });
        return;
    }
    User.findOne({ username })
        .then(user => {
            console.log(user);
            if (!user) {
                res.render('auth/login', {
                    errorMessage: 'The username doesn\'t exist, please create an account'
                });
            } else if (bcryptjs.compareSync(password, user.passwordHash)) {
                res.render('users/user-profile');
            } else {
                res.render('auth/login', {
                    errorMessage: 'The password isn\'t correct, please try again.'
                });
            }
        })
        .catch(error => {
            next(error);
        });
});


module.exports = router;