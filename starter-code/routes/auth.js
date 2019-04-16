const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');

/* GET home page */
router.get('/signup', (req, res, next) => {
    res.render('auth/signup');
});

router.get('/userProfile', (req, res, next) => {
    res.render('auth/userProfile');
});

router.get('/login', (req, res, next) => {
    res.render('auth/login');
});

router.post('/signup', (req, res, next) => {
    const { username, password } = req.body;
    const salt = bcrypt.genSaltSync();
    const hashPassword = bcrypt.hashSync(password, salt);

    if (username === '' || password === '') {
        res.render('auth/signup', {
            errorMessage: 'You need a username and a password to register'
        });
        return;
    }
    User.findOne({ username })
        .then(user => {
            if (user) {
                res.render('auth/signup', {
                    errorMessage: 'The username is already on use'
                });
                return;
            }
            User.create({ username, password: hashPassword })
                .then(user => {
                    console.log('User created succesfully: ', user);
                    res.redirect('/login');
                })
                .catch(err => {
                    console.error('Failed to create new user', err);
                });
        })
        .catch(err => {
            console.error('Failed to look up user', err);
        });
});

router.post('/login', (req, res, next) => {
    const { username, password } = req.body;

    if (username === '' || password === '') {
        res.render('auth/login', {
            errorMessage: 'You need a username and a password to login'
        });
        return;
    }

    User.findOne({ username })
        .then(user => {
            if (!user) {
                console.log('User not found');
                res.render('auth/login', {
                    errorMessage: 'No username was found'
                });
                return;
            }
            if (bcrypt.compareSync(password, user.password)) {
                console.log('User successfuly logged in');
                req.session.currentUser = user;
                res.redirect('/secret');
            }
            res.render('auth/login', {
                errorMessage: 'Wrong password'
            });
        })
        .catch(err => {
            console.error('Cannot find user', err);
        });
});

router.get("/logout", (req, res, next) => {
  req.session.destroy((err) => {
    // can't access session here
    res.redirect("/login");
  });
});

module.exports = router;
