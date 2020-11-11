const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const {
    Router
} = require("express");
const User = require("../models/User.model");

const router = new Router();
const saltRounds = 10;

router.get('/sign-up', (req, res, next) => res.render('auth/signup'));

router.post('/sign-up', (req, res, next) => {
    const {
        username,
        password
    } = req.body;

    bcrypt
        .genSalt(saltRounds)
        .then(salt => bcrypt.hash(password, salt))
        .then(hashedPassword => {
            return User.create({
                    username,
                    passwordHash: hashedPassword
                })
                .then(newUserDB => {
                    console.log(`Newly created user: ${newUserDB}`);
                    res.redirect('/profile');
                })
                .catch(error => next(error));
        })
        .catch(error => next(error));
});

router.get('/profile', (req, res, next) => {
    res.render('users/profile')
});

module.exports = router;