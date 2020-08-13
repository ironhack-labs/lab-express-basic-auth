const { Router } = require('express');
const router = new Router();
const bcrypt = require('bcrypt');
const saltRounds = 10;
const User = require('../models/User.model');
const mongoose = require('mongoose');

router.get('/signup', (req, res) => res.render('auth/signup'));

router.post('/signup', (req, res, next) => {
    const { username, password } = req.body;

    if (!username || !password) {
      res.render('auth/signup', { errorMessage: 'Username & Password Required' });
      return
    }

    const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    if (!regex.test(password)) {
      res.status(500).render('auth/signup', { errorMessage: 'Invalid Password' });
      return;
    }

    bcrypt
      .genSalt(saltRounds)
      .then(salt => bcrypt.hash(password, salt))
      .then(hashedPassword => {
        return User.create({
          username,
          passwordHash: hashedPassword
        });
      })
      .then(userFromDB => {
        console.log('New user: ', userFromDB);
        res.render('user/userProfile', userFromDB);
      })
      .catch(error => {
        if (error instanceof mongoose.Error.ValidationError) {
          res.status(500).render('auth/signup', { errorMessage: error.message });
        } else if (error.code === 11000) {
          res.status(500).render('auth/signup', {
            errorMessage: 'Invalid Username'
          });
        } else {
          next(error);
        }
      }); 
  });

  module.exports = router;