const { Router } = require('express');
const router = new Router();
const bcryptjs = require('bcryptjs');
const saltRounds = 10;
const User = require('../models/User.model');
const { Mongoose } = require('mongoose');

router.get('/signup', (req, res, next) => {
    res.render('auth/signup');
});

router.post('/signup', (req, res, next) => {
    const { username, password } = req.body;

    if (!username || !password) {
        res.render('auth/signup', {errorMessage: 'Please fill in all mandatory fields.'});
        return;
    }

    const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    if (!regex.test(password)) {
        res
        .status(500)
        .render('auth/signup', {errorMessage: 'Password needs to have at least 6 chars and must contain at least one number, one lowercase and one uppercase letter.'});
        return;
    }

    bcryptjs
        .genSalt(saltRounds)
        .then(salt => bcryptjs.hash(password, salt))
        .then(hashedPassword => {
            return User.create({username, passwordHash: hashedPassword});
        })
        .then(newUser => {
            res.redirect('/login');
        })
        .catch(error => {
            if (error.code === 11000) {
                res.status(500).render('auth/signup', {
                    errorMessage: 'This username is already taken, please choose a new one.'
                });
            } else {
                next(error);
            }
        });
});

router.get('/login', (req, res, next) => {
    res.render('auth/login');
});

router.post('/login', (req, res, next) => {
    console.log('Session:', req.session);

    const { username, password } = req.body;

    if (username === '' || password === '') {
        res.render('auth/login', {
            errorMessage: 'Enter both username and password to login.'
        });
        return;
    }

    User.findOne({username})
    .then(user =>  {
        if (!user) {
            res.render('auth/login', {errorMessage: `This user doesn't exist. Try a different username.`});
            return;
        } else if (bcryptjs.compareSync(password, user.passwordHash)) {
            req.session.currentUser = user;
            res.redirect('/userProfile')
        } else {
            res.render('auth/login', {errorMessage: 'Incorrect password.'});
        }
    })
    .catch(error => {
        next(error);
    })
});

router.post('/logout', (req, res, next) => {
    req.session.destroy();
    res.redirect('/');
});

router.get('/main', (req, res, next) => {
    res.render('users/main', { userInSession: req.session.currentUser });
});

router.get('/private', (req, res, next) => {
    res.render('users/private', { userInSession: req.session.currentUser });
});

router.get('/userProfile', (req, res, next) => {
    res.render('users/user-profile', { userInSession: req.session.currentUser });
});

module.exports = router;