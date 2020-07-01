const express = require("express");
const router = express.Router();
const User = require('../models/User.model');
const bcrypt = require('bcrypt');

router.get('/register', (req, res, next) => {
    res.render('register')
})

router.post('/register', (req, res, next) => {
    const {username, password} = req.body;
    if (password.length < 8) {
        res.render('register', {message: 'password is not long enough, you fool!'})
        return;
    }
    if (username === '') {
        res.render('register', {message: "Don't you have a name?"})
        return;
    }
    User
        .findOne({username})
        .then(found => {
            if (found !== null) {
                res.render('register', {message: 'User already exists'})
            } else {
                const salt = bcrypt.genSaltSync();
                const hash = bcrypt.hashSync(password, salt)
                User
                    .create({username, password: hash})
                    .then(user => {
                        console.log(req)
                        req.session.user = user;
                        res.redirect('/profile')
                    })
                    .catch(err => next(err))
            }
        })
        .catch(err => next(err))
})

router.get('/login', (req, res, next) => {
    res.render('login')
})

router.post('/login', (req, res, next) => {
    const {username, password} = req.body;
    User.findOne({username})
        .then(user => {
            if (user === null) {
                res.render('login', {message: 'invalid credentials, you fool!'})
            }
            if (bcrypt.compareSync(password, user.password)) {
                req.session.user = user;
                res.redirect('/profile');
            } else {
                res.render('login', {message: 'invalid credentials, you fool!'})
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