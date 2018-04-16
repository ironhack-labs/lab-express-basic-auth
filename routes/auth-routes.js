'use strict';

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
// BCrypt to encrypt passwords
const bcrypt = require('bcrypt');
const bcryptSalt = 10; // This number can be changed - unclear its meaning

// Connect schema
const User = require('../models/user');

// Mongoose configuration
mongoose.Promise = Promise;
mongoose.connect('mongodb://localhost/auth-users', {
  keepAlive: true,
  reconnectTries: Number.MAX_VALUE
});

// Routes
router.get('/signup', (req, res, next) => {
  res.render('./auth/signup'); // refers to where the template is located
});

router.post('/signup', (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const salt = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(password, salt);

  if (username === '' || password === '') {
    res.render('./auth/signup', {
      errorMessage: 'Indicate a username and a password to sign up'
    });
    return;
  }

  User.findOne({username: username})
    .then(result => {
      if (result) {
        res.render('./auth/signup', { errorMessage: 'The username already exists' });
      } else {
        const user = new User({
          username,
          password: hashPass
        });
        user.save()
          .then(() => {
            res.redirect('/'); // note that this refers to the URL of the route, not where the template is
          })
          .catch(next);
      }
    });
});

router.get('/login', (req, res, next) => {
  res.render('./auth/login'); // refers to where the template is located
});

router.post('/login', (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({ username: username })
    .then(user => {
      if (!user) {
        return res.redirect(`/auth/login`);
      } else if (bcrypt.compareSync(password, user.password)) {
        req.session.user = user;
        return res.redirect(`/`);
      } else {
        return res.redirect(`/auth/login`);
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
