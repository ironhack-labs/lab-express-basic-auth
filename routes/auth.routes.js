const express = require('express');
const router = express.Router();
const User = require('../models/User.model');
const bcrypt = require('bcryptjs');
const saltRounds = 10;
const mongoose = require('mongoose');
const { isLoggedIn, isLoggedOut } = require('../middleware/route-guard.js');


router.get('/signup', isLoggedOut,(req, res) => {
    res.render('auth/signup');
    }
);

router.post('/signup', (req, res) => {
    const {username, password}  = req.body;
    const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    if (!regex.test(password)) {
        res
        .status(500)
        .render('auth/signup', { error: 'Password needs to have at least 6 chars and must contain at least one number, one lowercase and one uppercase letter.' });
        return;
    }


    bcrypt
        .genSalt(saltRounds)
        .then(salt => bcrypt.hash(password, salt))
        .then(hashedPassword => {
            res.render('auth/login')
            return User.create({
                username,
                password: hashedPassword
            });
        })
        .catch(error => {
            if (error instanceof mongoose.Error.ValidationError) {
              res.status(500).render('auth/signup', { errorMessage: error.message });
            } else if (error.code === 11000) {
              res.status(500).render('auth/signup', {
                 errorMessage: 'Username and email need to be unique. Either username or email is already used.'
              });
            } else {
              next(error);
            }
        }); 
    }
);

router.get('/login', (req, res) => {
    res.render('auth/login');
    }
);
router.post('/login', (req, res) => {
    console.log('SESSION =====> ', req.session);
    const {username, password} = req.body;
    if (username === '' || password === '') {
        res.render('auth/login', { error: 'Please enter both, username and password to login.' });
        return;
    }
    User.findOne({ username })
        .then(user => {
            if (!user) {
                res.render('auth/login', { error: 'Username is not registered. Try with other username.' });
                return;
            } else if (bcrypt.compareSync(password, user.password)) {
                req.session.currentUser = user;
                res.redirect('/userProfile');
            } else {
                res.render('auth/login', { error: 'Incorrect password.' });
            }
        })
        .catch(error => next(error));
    }
);

router.get('/userProfile', isLoggedIn,(req, res) => {
    res.render('users/user-profile', { userInSession: req.session.currentUser });
    }
);

router.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) next(err);
        res.redirect('/');
      });
    }
);






module.exports = router;
