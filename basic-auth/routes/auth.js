'use strict';

const express = require('express');
const router = express.Router();

const User = require('../models/users');

// Bcrypt to encrypt passwords
const bcrypt = require('bcrypt');
const bcryptSalt = 10;

router.get('/signup', (req, res, next) => {
  res.render('auth/signup'); // without /auth!!
});

router.post('/signup', (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username === '' || password === '') { // Missing to check if username is unique
    res.render('auth/signup');
    return;
  }

  User.findOne({ username })
    .then(user => {
      if (user !== null) {
        res.render('auth/signup');
        return;
      }

      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);

      const newUser = new User({
        username,
        password: hashPass
      });

      newUser.save((err) => {
        if (err) {
          res.render('auth/signup');
        } else {
          res.redirect('/');
        }
      });
    })
    .catch(error => {
      next(error);
    });
});

router.get('/login', (req, res, next) => {
  if (req.session.currentUser) {
    res.redirect('/');
    return;
  }

  res.render('auth/login');
});

router.post('/login', (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  if (req.session.currentUser) {
    res.redirect('/');
    return;
  }

  if (username === '' || password === '') { // Missing to check if username is unique
    res.redirect('/auth/login');
    return;
  }

  User.findOne({ username })
    .then(user => {
      if (user) {
        if (bcrypt.compareSync(password, user.password)) {
          req.session.currentUser = user;
          res.redirect('/');
          return;
        } else {
          res.redirect('/auth/login');
          return;
        }
      };
    })
    .catch(next); // next without ()!!!!!!!!!
});

module.exports = router;
