const router = require('express').Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User.model');
const mongoose = require('mongoose');

router.get('/signup', (req, res, next) => {
    res.render('auth/signup');
});


router.post('/signup', (req, res, next) => {
    const {username, password} = req.body;
    
    if(!username || !password) {
        res.render('auth/signup', {
            errorMessage: 'Oopsie, all fields are required',
        });
        return;
    }
    
    bcrypt
    .genSalt(10)
    .then((salt) => bcrypt.hash(password, salt))
    .then((hashedPassword) => {
        return User.create({ username, password: hashedPassword });
    })
    .then(() => res.redirect('/profile'))
    .catch((err) => {
        if (err instanceof mongoose.Error.ValidationError) {
            console.log(err);
            res.status(500).render('auth/signup', {errorMessage: err.message});
        } else if (err.code === 11000) {
            console.log(err);
            res.status(500).render('auth/signup', {
                errorMessage:
                'Oopsie, the username and/or the password are already taken'
            });
        } else {
            next(err);
        }
    });
});

router.get('/login', (req, res, next) => {
    res.render('auth/login');
});

router.post('/login', (req, res, next) => {
    const {username, password} = req.body;
    console.log(req.session);

    if (!username || !password) {
        res.render('auth/login', {
            errorMessage: 'Oopsie, all fields are mandatory'
        });
    }

    User.findOne({username})
    .then((user) => {
        if(!user) {
            res.render('auth/login', {
                errorMessage: 'This username is not registered :('
            });
            return;
        } else if (bcrypt.compareSync(password, user.password)) {
            req.session.currentUser = user;
            res.redirect('/profile');
        } else {
            res.render('auth/login', {
                errorMessage: 'Oopsie, incorrect password'
            })
        }
    })
    .catch((err) => next(err));
})

module.exports = router;