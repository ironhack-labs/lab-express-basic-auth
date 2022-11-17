const router = require('express').Router();
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = require('../models/User.model');
const saltRounds = 12;

router.get('/signup', (req, res) => {
    res.render('auth/signup');
});

router.post('/signup', async (req, res, next) => {
    try {
        const { username, password } = req.body;

        //not correct input values
        if (!username || !password) {
            res.render('auth/signup', {
                errorMessage:
                    'All fields are mandatory. Please provide your username and password.',
            });
            return;
        }

        // check password
        const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
        if (!regex.test(password)) {
            res.render('auth/signup', {
                errorMessage:
                    'Password needs to have at least 6 chars and must contain at least one number, one lowercase and one uppercase letter.',
            });
            return;
        }

        const salt = await bcrypt.genSalt(saltRounds);
        const passwordHash = await bcrypt.hash(password, salt);

        const savedUser = await User.create({
            username,
            password: passwordHash,
        });

        console.log('created user: ', savedUser);

        res.redirect('/login');
    } catch (err) {
        if (err instanceof mongoose.Error.ValidationError) {
            res.status(500).render('auth/signup', {
                errorMessage: err.message,
            });
        } else {
            next(err);
        }
    }
});

router.get('/login', (req, res) => res.render('auth/login'));

router.post('/login', async (req, res, next) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            res.render('auth/login', {
                errorMessage:
                    'Please enter both username and password to login',
            });
            return;
        }

        const user = await User.findOne({ username });

        if (!user) {
            res.render('auth/login', {
                errorMessage: 'user is not registered',
            });
            return;
        }

        if (bcrypt.compareSync(password, user.password)) {
            req.session.user = user;
            res.render('users/main', { user });
        } else {
            res.render('auth/login', { errorMessage: 'Incorrect password' });
        }
    } catch (err) {
        if (err instanceof mongoose.Error.ValidationError) {
            res.status(500).render('auth/login', {
                errorMessage: err.message,
            });
        }
        next(err);
    }
});

router.get('/main', (req, res) => {
    const { user } = req.session;
    if (!user) {
        res.render('auth/login', { errorMessage: 'You need to login first!!' });
        return;
    }
    res.render('users/main', { user: req.session.user });
});

router.get('/private', (req, res) => {
    const { user } = req.session;
    if (!user) {
        res.render('auth/login', { errorMessage: 'You need to login first!!' });
        return;
    }
    res.render('users/private');
});

router.post('/logout', (req, res, next) => {
    req.session.destroy((err) => {
        if (err) next(err);
        res.redirect('/');
    });
});

module.exports = router;
