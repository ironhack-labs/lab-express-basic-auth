const express = require('express');
const router = express.Router();
// require user
const User = require('../models/user');

// require bcrypt
const bcrypt = require('bcrypt');
const bcryptSalt = 11;

router.get('/signup', (req, res, next) => {
    res.render('auth/signup');
});

router.post('/signup', (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;

    if (username === '' || password === '') {
        res.render('auth/signup', {
            errorMessage: 'Indicate a username and a password to sign up'
        });
        return;
    }

    User.findOne({ username: username })
        .then(user => {
            if (user !== null) {
                res.render('auth/signup', {
                    errorMessage: 'The username already exists!'
                });
                return;
            }
            const salt = bcrypt.genSaltSync(bcryptSalt);
            const hashPass = bcrypt.hashSync(password, salt);

            User.create({
                username,
                password: hashPass
            })
                .then(() => {
                    res.redirect('/');
                })
                .catch(error => {
                    console.log(error);
                });
        })
        .catch(error => {
            next(error);
            console.log(error);
        });
});

module.exports = router;
