'use strict';

const express = require('express');
const router = express.Router();

// User model
const User = require('../models/user');

// BCrypt to encrypt passwords
const bcrypt = require('bcrypt');
const bcryptSalt = 10;

router.get('/welcome', (req, res, next) => {
  res.render('welcome');
});

router.get('/login', (req, res, next) => {
  res.render('auth/login');
});

router.post('/login', (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username === '' || password === '') {
    res.render('auth/login', {
      errorMessage: 'Indicate a username and a password to sign up'
    });
    return;
  }

  User.findOne({ 'username': username })
    .then(result => {
      if (!result) {
        res.render('auth/login', {
          errorMessage: "The username doesn't exist"
        });
      } else if (bcrypt.compareSync(password, result.password)) {
        // here says user undefined and crash!!!!!HELP!!!!!
        req.session.user = result;
        res.redirect('/welcome');
      } else {
        res.render('auth/login', {
          errorMessage: 'Incorrect password'
        });
      }
    }).catch(next);
});

router.get('/signup', function (req, res, next) {
  res.render('auth/sign-up');
});

router.post('/signup', (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const salt = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(password, salt);

  if (username === '' || password === '') {
    res.render('auth/sign-up', {
      errorMessage: 'Indicate a username and a password to sign up'
    });
    return;
  }

  // here check if user already exist
  User.findOne({ username: username })
    .then(result => {
      if (result) {
        res.render('auth/sign-up', {
          errorMessage: 'User already exist'
        });
      }
      const user = new User({
        username,
        password: hashPass
      });

      user.save()
        .then(() => {
          res.redirect('/signup');
        })
        .catch(next);
    });
});

module.exports = router;
