'use strict';

// -- require npm packages
const express = require('express');
const router = express.Router();

// -- require your own modules (router, models)

const User = require('../models/user');

// Bcrypt to encrypt passwords
const bcrypt = require('bcrypt');
const bcryptSalt = 10;

// -- routes

router.get('/login', (req, res, next) => {
  res.render('./auth/login');
});

// router.post('/login', (req, res, next) => {
//   User.findOne(req.session.user)
//     .then(() => {
//       res.redirect('/');
//     });
// });

router.post('/login', (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({ username: username })
    .then(user => {
      if (!user) {
        return res.redirect('/auth/login');
      } else if (bcrypt.compareSync(password, user.password)) {
        req.session.user = user;
        return res.redirect('/');
      } else {
        return res.redirect('/auth/login');
      }
    })
    .catch(next);
});

router.get('/signup', (req, res, next) => {
  res.render('./auth/signup');
});

// router.post('/signup', (req, res, next) => {
//   const user = new User(req.body);
//   user.save()
//     .then(() => {
//       res.redirect('../');
//     });
// });

router.post('/signup', (req, res, next) => {
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
});

router.post('/logout', (req, res, next) => {
  if (req.session.user) {
    req.session.user = null;
  }
  res.redirect('/');
});

module.exports = router;
