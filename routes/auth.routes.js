const router = require('express').Router();
const mongoose = require('mongoose');
const User = require('../models/User.model');
const bcryptjs = require('bcryptjs');
const saltRounds = 10;


router.get('/signup', (req, res) => res.render('auth/signup'));

router.post('/signup', (req, res, next) => {
    // console.log('The form data: ', req.body);
    const { username, password } = req.body;

    bcryptjs
    .genSalt(saltRounds)
    .then((salt) => bcryptjs.hash(password, salt))
    .then((hashedPassword) => {
        return User.create({
            username,
            password: hashedPassword
        });
        // console.log(`Password hash: ${hashedPassword}`);
    })
    .then((userFromDB) => {
        res.redirect('/userProfile');
    })
    .catch(error => next(error));
});

router.get('/login', (req, res) => res.render('auth/login'));

router.post('/login', (req, res, next) => {
    console.log('SESSION =====> ', req.session);

    const { username, password } = req.body;

    if(username === '' || password === '' ) {
        res.render('auth/login', {
            errorMessage: 'Please enter both username and password to login.'
        });
        return;
    }
    User.findOne({ username })
        .then(user => {
            if(!user) {
                res.render('auth/login', { errorMessage: 'Username is not registered. Try with another Username'});
                return;
            } else if(bcryptjs.compareSync(password, user.password)) {
                req.session.currentUser = user;
                res.redirect('/userProfile');
            } else {
                res.render('auth/login', { errorMessage: 'Incorrect password.' });
            }
        })
        .catch(error => next(error));
})

router.get('/userProfile', (req, res) => {
    res.render('users/user-profile', { userInSession: req.session.currentUser });
});

module.exports = router;