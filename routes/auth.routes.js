const express = require('express');
const User = require('../models/User.model');
const router = express.Router();
const saltRound = 10;
const bcrypt = require('bcryptjs');

router.get('/signup', (req, res, next) => {
    res.render('signup');
})

router.post('/signup', (req, res, next) => {
    const {username, password } = req.body;
    if(!username || !password) {
        res.render('signup', { errorMessage: "Username and password are requiered" });
    }

    User.findOne({ username })
    .then( user => {
        if(user) {
            res.render('signup', { errorMessage: "User already exists" });
        }

        const salt = bcrypt.genSaltSync(saltRound);
        const hashPassword = bcrypt.hashSync(password, salt);

        User.create({ username, password: hashPassword })
        .then(() => res.render('index'))
        .catch(error => res.render('signup', { errorMessage: error }))
    })
    .catch(error => next(error))
})

router.get('/login', (req, res, next) => {
    res.render('login');
})

router.post('/login', (req, res, next) => {
    const {username, password} = req.body;
    if(!username || !password) {
        res.render('login', { errorMessage: "Username and password are requiered" });
    }

    User.findOne({ username })
    .then( user => {
        if(!user) {
            res.render('login', { errorMessage: "Incorrect user or password" })
        }
        const passwordCorrect = bcrypt.compareSync(password, user.password);
        if(passwordCorrect){
            req.session.currentUser = user;
            res.redirect('/auth/profile');
        } else {
            res.render('login', {errorMessage: 'Incorrect email or password'})
        }
    })
})

router.get('/profile', (req, res) => {
    res.render('profile', { user: req.session.currentUser});
})

router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if(err) res.redirect('/');
        else res.redirect('/auth/login');
    })
})

module.exports = router;