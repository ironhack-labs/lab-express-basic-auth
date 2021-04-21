const router = require('express').Router();
const User = require('../models/User.model');
const bcrypt = require('bcrypt');

router.get('/signup', (req, res) => {
    res.render('signup');
});

router.get('/login', (req, res) => {
    res.render('login');
});

router.post('/login', (req, res, next) => {
    const { username, password } = req.body;
    User.findOne({ username: username})
        .then(userFromDB => {
            if (userFromDB === null) {
                res.render('login', { message: 'Invalid credentials' });
                return;
            }
            if (bcrypt.compareSync(password, userFromDB.password)) {
                req.session.user = userFromDB;
                res.redirect('/private');
            }
        })
});

router.post('/signup', (req, res, next) => {
    const { username, password } = req.body;
    if (password.length < 8) {
        res.render('signup', { message: 'Your password has to be at least 8 characters long' });
        return;
    }
    if (username === '') {
        res.render('signup', { message: 'Your username cannot be empty' });
        return;
    }
    User.findOne({ username: username })
        .then(userFromDB => {
            if (userFromDB !== null) res.render('signup', { message: 'This username is already taken' });
            else {
                const salt = bcrypt.genSaltSync();
                const hash = bcrypt.hashSync(password, salt);
                User.create({ username: username, password: hash })
                    .then(createdUser => {
                        res.redirect('/');
                    })
            }
        })
});

router.get('/logout', (req, res, next) => {
    req.session.destroy(err => {
        if (err) next(err);
        else res.redirect('/');
    });
});

module.exports = router;