'use strict';

const express = require('express');
const router = express.Router();

const User = require('../models/users');

// Bcrypt to encrypt passwords
const bcrypt = require('bcrypt');
const bcryptSalt = 10;

router.get('/signup', (req, res, next) => {
  if (req.session.currentUser) {
    res.redirect('/');
    return;
  }
  res.render('auth/signup'); // without /auth!!
});

router.post('/signup', (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  if (req.session.currentUser) {
    res.redirect('/'); // Never render !! (would be like starting from scratch) --> when refreshing the page, does not send the form
    return;
  }

  if (username === '' || password === '') {
    res.redirect('/auth/signup');
    return;
  }

  User.findOne({ username })
    .then(user => {
      if (user !== null) { // Checks if username is unique
        res.redirect('/auth/signup');
        return;
      }

      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);

      const newUser = new User({
        username,
        password: hashPass
      });

      newUser.save((err) => { // Should always go inside findOne, otherwise runs at the same time and findOne does not have time to finish
        if (err) {
          res.redirect('/auth/signup');
        } else {
          req.session.currentUser = newUser;
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

  if (username === '' || password === '') {
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
    .catch(next); // next without (), otherwise it calls next() always !!!!!!!!!
});

// LOG OUT
router.get('/logout', (req, res, next) => {
  delete req.session.currentUser; // IMPORTANT TO KNOW HOW TO DELETE!
  res.redirect('/auth/login');
});

module.exports = router;
