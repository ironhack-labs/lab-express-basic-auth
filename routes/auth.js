const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/User.model');

router.get('/signup', (req, res) => {
    res.render('signup');
})

router.get('/login', (req, res) => {
    res.render('login');
})


router.post('/signup', (req, res, next) => {
    const { username, password } = req.body;
    if (password.length < 8) {
        return res.render('signup', { message: 'Password has to be longer than 8 characters' });
    }
    if (username === '') {
        return res.render('signup', { message: 'Username has to be provided' });
    }
    User.findOne({ username })
    .then((dbUser) => {
        if (dbUser !== null) {
            return res.render('signup', { message: 'This username has already been taken. Try a different one.' });
        } else {
            const salt = bcrypt.genSaltSync();
            const hash = bcrypt.hashSync(password, salt);
            User.create({ 
                username,
                password: hash
            })
            .then(user => {
                req.session.user = user;
                res.redirect('/');
            })
            .catch(err => {
                next(err)
            })
        }
    })
})

router.post('/login', (req, res) => {
    const { username, password } = req.body;
    User.findOne( { username })
    .then(user => {
        if (user === null) {
            res.redirect('/login', { message: 'Invalid credentials'});
        }
        if (bcrypt.compareSync(password, user.password)) {
            req.session.user = username;
            res.redirect('/')
        } else {
            res.redirect('/login', { message: 'Invalid credentials'});
        }
    })
})

router.get('/logout', (req, res, next) => {
    req.session.destroy(err => {
        if (err) {
            next(err)
        } else {
            res.redirect('/')
        }
    })
})

module.exports = router;