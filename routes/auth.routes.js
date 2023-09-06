const { Router } = require('express');
const router = new Router();
const bcryptjs = require('bcryptjs');
const saltRounds = 10;
const User = require('../models/User.model');


// GET router to display the form:
router.get('/signup', (req, res) => res.render('auth/signup'));

// POST route ==> to process form data
router.post('/signup', (req, res, next) => {
    const { username, password } = req.body;
    if (!username || !password) {
        res.render('auth/signup', { errorMessage: 'All fields are mandatory. Please provide your username and password.' });
        return;
    }
    bcryptjs
        .genSalt(saltRounds)
        .then(salt => bcryptjs.hash(password, salt))
        .then(hashedPassword => {
            // console.log(`Password hash: ${hashedPassword}`);
            return User.create({
                username,
                passwordHash: hashedPassword
            });

        })
        .then(userFromDB => {
            // console.log('Newly created user is: ', userFromDB);
            res.redirect('/private');
        })
        .catch(error => {
            if (error.code === 11000) {

                console.log("Username needs to be unique. Username is already used.");

                res.status(500).render('auth/signup', {
                    errorMessage: 'Username needs to be unique. Username is already used.'
                });
            }
            next(error);
        })
});

// GET route ==> to display the login form to users
router.get('/login', (req, res) => res.render('auth/login'));

// POST login route ==> to process form data
router.post('/login', (req, res, next) => {

    const { username, password } = req.body;

    if (username === '' || password === '') {
        res.render('auth/login', {
            errorMessage: 'Please enter both username and password to login.'
        });
        return;
    }

    User.findOne({ username })
        .then(user => {
            if (!user) {
                console.log("Username not registered. ");
                res.render('auth/login', { errorMessage: 'User not found and/or incorrect password.' });
                return;
            } else if (bcryptjs.compareSync(password, user.passwordHash)) {
                req.session.currentUser = user;
                res.redirect('/private');
            } else {
                console.log("Incorrect password. ");
                res.render('auth/login', { errorMessage: 'User not found and/or incorrect password.' });
            }
        })
        .catch(error => next(error));
});

router.post('/logout', (req, res, next) => {
    req.session.destroy(err => {
        if (err) next(err);
        res.redirect('/');
    });
});

router.get('/private', (req, res) => {
    res.render('users/private', { userInSession: req.session.currentUser });
});

module.exports = router;