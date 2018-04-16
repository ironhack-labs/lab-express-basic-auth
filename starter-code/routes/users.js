'use strict';

const express = require('express');
const bcrypt = require('bcrypt');
const bcryptSalt = 10;

const User = require('../models/users');

const router = express.Router();

router.get('/login', function (req, res, next) {
  if (!req.session.currentUser) {
    res.render('auth/login');
  } else {
    res.redirect('/');
  }
});

router.post('/login', (req, res, next) => {
  if (!req.session.currentUser) {
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({ 'username': username })
      .then((result) => {
        if (result) {
          if (bcrypt.compareSync(password, result.password)) {
            req.session.currentUser = result;
            res.redirect('/');
          } else {
            res.redirect('/auth/login');
          }
        } else {
          res.redirect('/auth/login');
        }
      })
      .catch(next);
  } else {
    res.redirect('/');
  }
});

router.get('/signup', function (req, res, next) {
  if (!req.session.currentUser) {
    res.render('auth/signup');
  } else {
    res.redirect('/');
  }
});

router.post('/signup', (req, res, next) => {
  if (!req.session.currentUser) {
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({ 'username': username })
      .then((result) => {
        if (!result) {
          const salt = bcrypt.genSaltSync(bcryptSalt);
          const hashPass = bcrypt.hashSync(password, salt);

          const user = new User({
            username,
            password: hashPass
          });

          user.save()
            .then(() => {
              res.redirect('/');
            });
        } else {
          res.redirect('/auth/signup');
        }
      })
      .catch(next);
  } else {
    res.redirect('/');
  }
});

router.post('/logout', (req, res, next) => {
  if (req.session.currentUser) {
    req.session.currentUser = null;
    res.redirect('/');
  } else {
    res.redirect('/');
  }
});

module.exports = router;
