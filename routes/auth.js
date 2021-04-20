const express = require('express');
const router = express.Router();
const User = require('../models/User.model');
const bcrypt = require('bcrypt');


router.get('/signup', (req, res, next) => res.render('signup'));

router.post('/signup', (req, res, next) => {
    const { username, password } = req.body;

    if (password.length < 8) {
        res.render('signup', { message: 'Password must be 8 characters long' });
        return
    }

    if (username === '') {
        res.render('signup', { message: 'Username cannot be empty' });
        return
    }

    User.findOne({ username })
        .then(userFromDB => {
            if (userFromDB !== null) {
                res.render('signup', { message: 'Username is already taken' });
            } else {
                const salt = bcrypt.genSaltSync();
                const hash = bcrypt.hashSync(password, salt);

                User.create({ username, password: hash })
                    .then(newUser => {
                        console.log(newUser);
                        res.redirect('/');
                    })
                    .catch(err => {
                        next(err);
                    });
            }
        })
        .catch(err => {
            next(err);
        });
});

module.exports = router;