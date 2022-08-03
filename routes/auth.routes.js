const router = require('express').Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User.model');
const mongoose = require('mongoose');
const {isLoggedOut, isLoggedIn} = require('../middleware/route-guard')

router.get('/signup', isLoggedOut, (req, res, next) => {
    res.render('auth/signup')
});

router.post('/signup', isLoggedOut, (req, res, next) => {
    const {username, password} = req.body;

    bcrypt.genSalt(10)
    .then((salt) => bcrypt.hashSync(password, salt))
    .then((hashedPassword) => {
        return User.create({username, password: hashedPassword})
    })
    .then(() => res.redirect('/profile'))
    .catch((err) => {
        if (err instanceof mongoose.Error.ValidationError) {
            res.status(500).render('auth/signup', { errorMessage: 'USERNAME NEEDED.'})
        } else if (err.code === 11000){
            res.status(500).render('auth/signup', { errorMessage: 'This username is already taken.'})
        }
         else {
        next(err)
        }
    });
})

router.get('/login', isLoggedOut, (req, res, next) => {
    res.render('auth/login')
});

router.post('/login', isLoggedOut, (req, res, next) => {
    const {username, password} = req.body;

    if(!username || !password) {
        res.render('auth/login', {
            errorMessage: 'Please complete all the fields.'
        });
        return;
    }

    User.findOne({ username })
    .then((user) => {
        if(!user) {
            res.render('auth/login', {
                errorMessage: 'Username was not found.'
            });
            return;
        } else if (bcrypt.compareSync(password, user.password)) {
            req.session.currentUser = user;
            res.redirect('/profile');
        } else {
            res.render('auth/profile', {
                errorMessage: 'Incorrect password.'
            })
        }
    })
    .catch((err) => next(err));
});

router.get('/profile', isLoggedIn, (req, res, next) => {
    res.render('auth/profile', { user: req.session.currentUser })
});

router.get('/logout', isLoggedIn, (req, res, next) => {
    req.session.destroy((err) => {
        if (err) next(err);
        res.redirect('/')
    })
})

router.get('/main', (req, res, next) => {
    if (req.session.currentUser) {
        res.render('auth/main')
    } else {
        res.redirect('/private')
    }
})

router.get('/private', (req, res, next) => {
    if (!req.session.currentUser) {
        res.redirect('/login');
    } else {
        res.render('auth/private')
    }
})

module.exports = router;