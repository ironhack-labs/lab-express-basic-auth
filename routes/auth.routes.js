const express = require('express');
const router = express.Router();
const bcryptjs = require('bcryptjs');
const saltRounds = 10;

const User = require('../models/User.model');

router.get('/signup', (req, res, next) => res.status(200).render('auth/signup'));

router.post('/signup', (req, res, next) => {
    const { username, password } = req.body;

    bcryptjs
    .genSalt(saltRounds)
    .then(salt => bcryptjs.hash(password, salt))
    .then(hashedPassword => {
      return User.create({
          username,
          passwordHash: hashedPassword
      })
    })
    .then(user => res.redirect('/user-profile'))
    .catch(error => next(error));
});

router.get('/login', (req, res) => res.status(200).render('auth/login'));

router.post('/login', (req, res, next) => {
    const { username, password } = req.body;

    if(!username || !password) {
        res.render('auth/login', {errorMessage: 'Please enter both, email and password to login.'});
        return;
    }

    User
    .findOne({ username })
    .then(user => {
        if(!user) {
            res.render('auth/login', {errorMessage: `The username doesn't exist.`});
            return;
        } else {
            bcryptjs
            .compare(password, user.passwordHash)
            .then(samePassword => {
                if(samePassword) {
                    req.session.user = user;
                    res.redirect('/user-profile');
                    
                } else {
                    res.render('auth/login', { errorMessage: 'Incorrect password.' });
                }
            })
            .catch(err => next(err));
        }
    })
    .catch(err => next(err));
});

module.exports = router;
