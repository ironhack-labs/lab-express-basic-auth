const express = require('express');
const router = express.Router();

const User = require('../models/User.model');

const bcryptjs = require('bcryptjs');
const saltRound = 10;
const mongoose = require('mongoose');

router.get('/signup', (req, res, next) => res.render('auth/signup'));

router.post('/signup', (req, res, next) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        res.render('auth/signup', { errorMessage: 'All fields are mandatory.'});
        return;
    }   

    const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    if (!regex.test(password)) {
        res
            .status(500)
            .render('auth/signup', { errorMessage: 'Password length should be at least 6 with at least one number, one lowercase and one uppercase.'});
        return;
    }

    bcryptjs.genSalt(saltRound)
        .then(salt => bcryptjs.hash(password, salt))
        .then(hashedPassword => {
            return User.create({
                username,
                email,
                passwordHash: hashedPassword
            });
        })
        .then(userFromDB => {
            res.redirect('/userProfile');
        })
        .catch(error => {
            if (error instanceof mongoose.Error.ValidationError) {
                res
                    .status(500)
                    .render('auth/signup',  { errorMessage: error.message});
            } else if (error.code === 11000) {
                res
                    .status(500)
                    .render('auth/signup', { errorMessage: 'Username and email need to be unique! Either username or email is already used. Please retry'});
            } else {
                next(error);
            }
        });
});

router.get('/login', (req, res, next) => res.render('auth/login'));

router.post('/login', (req, res, next) => {
    const { email, password } = req.body;

    if (email === '' || password === '') {
        res.render('auth/login', { errorMessage: 'Please enter both email and password to login.'});
        return;
    }

    User.findOne( { email })
        .then(user => {
            if (!user) {
                res.render('auth/login', {errorMessage: 'Email is not registered. Try with other email.'});
                return;
            } else if (bcryptjs.compareSync(password, user.passwordHash)) {
                req.session.currentUser = user;
                res.redirect('/userProfile');
            } else {
                res.render('auth/login', { errorMessage: 'Incorrect password.'});
            }
        })
        .catch(err => next(err));
});

router.get('/userProfile', (req, res) => {
    res.render('users/user-profile', { userInSession: req.session.currentUser });
});

router.get('/main', (req, res) => {
    res.render('users/main', { userInSession: req.session.currentUser });
});

router.get('/private', (req, res) => {
    res.render('users/private', { userInSession: req.session.currentUser });
});

router.post('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

module.exports = router;
