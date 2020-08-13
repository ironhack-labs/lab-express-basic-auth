const { Router } = require('express');
const router = new Router();

const bcryptjs = require('bcryptjs');
const saltRounds = 10;
const User = require('../models/User.model');
const mongoose = require('mongoose');

router.get('/signup', (req,res) => {
    res.render('auth/sign-up')
})

router.post('/signup', (req,res,next) => {
    const { username, email, password } = req.body;

    if (!username | !email, !password) {
        res.render('auth/sign-up', {errorMessage: 'All fields are required! Provide username, email and password'} )
    }

    const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    if (!regex.test(password)) {
      res
        .status(500)
        .render('auth/sign-up', { errorMessage: 'Create a stronger password. It needs to have at least 6 chars and must contain at least one number, one lowercase and one uppercase letter.' });
      return;
    }

    bcryptjs
    .genSalt(saltRounds)
    .then(salt => bcryptjs.hash(password,salt))
    .then(hashedPassword => {
        return User.create({
            username,
            email,
            passwordHash: hashedPassword
        })
    })
    .then(userFromDb => {
        console.log('new user created: ', userFromDb);
        res.redirect('/');
    })
    .catch(err => {
        if (err instanceof mongoose.Error.ValidationError) {
            res.status(500).render('auth/sign-up', { errorMessage: err.message });
          } else if (err.code === 11000) {
            res.status(500).render('auth/sign-up', {
              errorMessage: 'Username and email need to be unique. Either username or email is already used.'
            });
          } else {
            next(err);
          }
        }); 
})

module.exports = router;