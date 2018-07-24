const express = require('express');
const router = express.Router();
const bcrypt = require("bcrypt");
const saltRounds = 10;

const User = require('../models/user');

router.get('/signup', (req, res, next) => {
    res.render('auth/signup');
});

router.post('/signup', (req, res, next) => {
    const { username, password } = req.body;
    if(!username || !password) return res.render('auth/signup', { message: 'Invalid fields.'});

    User.findOne({ username })
    .then(user => {
        //User existe
        if (user) {
            return res.render('auth/signup', { message: 'El usuario ya existe.' })
        } else {
            //User no existe
            const salt = bcrypt.genSaltSync(saltRounds);
            const hashedPassword = bcrypt.hashSync(password, salt);
            const newUser = new User({ username, password: hashedPassword });
            return newUser.save();
        }
    })
    .then(user => {
        req.session.currentUser = user;
        
        res.redirect('/');
    })
    .catch(error => {
        next(error);
    });
});

router.get('/login', (req, res, next) => {
    res.render('auth/login');
});

router.post('/login', (req, res, next) => {
    const { username, password } = req.body;

    if(!username || !password) return res.render('auth/login', { message: 'Login error.'})

    User.findOne({ username })
    .then(user => {
        if(!user) return res.render('auth/login', { message: 'Incorrect user.'});

        if (bcrypt.compareSync(password /* provided password */, user.password/* hashed password */)) {
            // Save the login in the session!
            req.session.currentUser = user;
            res.redirect("/main");
        } else {
            res.redirect("/auth/login");
        }
    })
    .catch(error => {
        next(error);
    });
    
});

router.post('/logout', (req, res, next) => {
    delete req.session.currentUser;
    res.redirect('/');
});

module.exports = router;