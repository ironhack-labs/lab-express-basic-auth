'use strict';

const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const router = express.Router();
const bcryptSalt = 10;

// ---------- Sign up ---------- //
router.get('/signup', (req, res, next) => {
  if (req.session.user) {
    return res.redirect('/');
  };
  res.render('pages/auth/login');
});

router.post('/signup', (req, res, next) => {
  if (req.session.user) {
    return res.redirect('/');
  };
  res.render('pages/auth/login');

  const username = req.body.username;
  const password = req.body.password;

  if (!username || !username) {
    return res.redirect('/auth/signup');
  };

  const salt = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(password, salt);

  User.findOne({ username: username })
    .then(result => {
      if (!result) {
        return res.redirect('/auth/signup');
      } else {
        const user = User({
          username,
          password: hashPass
        });
        user.save()
          .then(() => {
            return res.redirect('/');
          })
          .catch(next);
      };
    })
    .catch(next);
});

// ---------- Login ---------- //

router.get('/login', (req, res, next) => {
  if (req.session.user) {
    return res.redirect('/');
  };
  res.render('pages/auth/login');
});

router.post('/login', (req, res, next) => {
  if (req.session.user) {
    return res.redirect('/');
  };
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({ username: username })
    .then(result => {
      if (!result) {
        return res.redirect('/auth/login');
      } else if (bcrypt.compareSync(password, result.password)) {
        req.session.user = result;
        return res.redirect('/');
      } else {
        return res.redirect('/auth/login');
      }
    })
    .catch(next);
});

// ---------- Log out ---------- //

router.post('/logout', (req, res, next) => {
  delete req.session.user;
  return res.redirect('/');
});

module.exports = router;
