const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('./../models/User.model');
const saltRounds = 10;
const { isLoggedOut } = require('../middleware/route-guard');

router.get('/register', isLoggedOut, (req, res) => {
    res.render('auth/signup');
});

router.post('/register', isLoggedOut, (req, res, next) => {
    const { username, plainPassword } = req.body;

    bcrypt.genSalt(saltRounds)
        .then(salt => bcrypt.hash(plainPassword, salt))
        .then(passwordHash => User.create({ username, password: passwordHash }))
        .then(() => res.redirect('/login'))
        .catch(err => next(err));
});

router.get('/login', isLoggedOut, (req, res, next) => {
    res.render('auth/login');
});

router.post('/login', isLoggedOut, (req, res, next) => {
    const { username, password } = req.body;

    if (!username || !password) {
        res.render('auth/login', { errorMessage: 'Username and password are required' });
        return;
    }

    User
    .findOne({ username })
        .then(foundUser => {
            if (!foundUser) {
                res.render('auth/login', { errorMessage: 'Username not registered' });
                return;
            }

            bcrypt.compare(password, foundUser.password)
                .then(isPasswordValid => {
                    if (!isPasswordValid) {
                        res.render('auth/login', { errorMessage: 'Invalid password' });
                        return;
                    }

                    req.session.currentUser = foundUser;
                    res.redirect('/');
                });
        })
        .catch(err => next(err));
});

router.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
});

module.exports = router;
