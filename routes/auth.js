const router = require('express').Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User.model');
const mongoose = require('mongoose');



router.get('/signup', (req, res) => res.render('auth/signup'));

router.post('/signup', async (req, res, next) => {
    const { username, password } = req.body;

    try {
        if (!username || !password) {
            res.render('auth/signup', {
                errorMessage: 'All the fields are mandatory. Please input a username and passoword',
            });
            return;
        }

        const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
        if (!regex.test(password)) {
            res.status(500).render('auth/signup', {
                errorMessage:
                    'Invalid password, password needs to have at least 6 characters, include an uppercase and lowercase character.',
            });
        }

        const salt = await bcrypt.genSalt(10);

        const hashedPassword = await bcrypt.hash(password, salt);

        const createdUser = await User.create({ username, password: hashedPassword });

        res.redirect('/profile');
    } catch (error) {
        console.log(error);
        if (error instanceof mongoose.Error.ValidationError) {
            res.status(500).render('auth/signup', { errorMessage: error.message });
        } else if (error.code === 11000) {
            res.status(500).render('auth/signup', { errorMessage: ' Username already exists' });
        }

        next(error);
    }
});

router.get('/login', (req, res) => res.render('auth/login'));

router.post('/login', async (req, res, next) => {
    const { username, password } = req.body;
    try {
        if (!password || !username) {
            res.render('auth/login', {
                errorMessage: 'All the fields are mandatory. Please input an username and passowrd',
            });
            return;
        }

        const user = await User.findOne({ username });

        if (!user) {
            res.render('auth/login', {
                errorMessage: 'Username not found',
            });
            return;
        } else if (bcrypt.compareSync(password, user.password)) {
            req.session.user = user;
            res.redirect('/profile');
        } else {
            res.render('auth/login', {
                errorMessage: 'Wrong password.',
            });
        }
    } catch (error) {
        console.log(error);
        next(error);
    }
});

router.get('/profile', (req, res) => {
    const user = req.session.user;
    console.log(user);

    res.render('profile', user);
});

router.post('/logout', (req, res, next) => {
    if (!req.session) res.redirect('/');

    req.session.destroy((err) => {
        if (err) next(err);
        else res.redirect('/');
    });
});

module.exports = router;
