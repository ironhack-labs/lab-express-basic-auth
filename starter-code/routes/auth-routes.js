const express = require('express');
const router = express.Router();
const User = require('../models/user');

const bcrypt = require('bcrypt');
// const bcryptSalt = 11;

router.get('/login', (req, res, next) => {
    res.render('auth/login');
});

router.get('/logout', (req, res, next) => {
    req.session.destroy(err => {
        res.redirect('/login');
    });
});

router.post('/login', (req, res, next) => {
    const theUsername = req.body.username;
    const thePassword = req.body.password;

    if (theUsername === '' || thePassword === '') {
        res.render('auth/login', {
            errorMessage: 'Please enter both, username and password to sign up.'
        });
        return;
    }

    User.findOne({ username: theUsername })
        .then(user => {
            if (!user) {
                res.render('auth/login', {
                    errorMessage: "The username doesn't exist."
                });
                return;
            }
            if (bcrypt.compareSync(thePassword, user.password)) {
                // Save the login in the session!
                req.session.currentUser = user;
                res.redirect('/secret');
            } else {
                res.render('auth/login', {
                    errorMessage: 'Incorrect password'
                });
            }
        })

        .catch(error => {
            next(error);
        });
});

module.exports = router;
