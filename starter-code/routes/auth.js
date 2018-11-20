'use strict';

const express = require('express');
const router = express.Router();
const User = require('../models/user');
const authMiddleware = require('../middlewares/authMiddleware');
const formMiddleware = require('../middlewares/formMiddleware');

const bcrypt = require('bcrypt');
const saltRounds = 10;

router.get('/signup', (req, res, next) => {
  res.render('auth/signup');
});

router.post('/signup', authMiddleware.requireAnon, formMiddleware.requireFields, (req, res, next) => {
  const { username, password } = req.body;

  User.findOne({ username })
    .then((user) => {
      if (user) {
        // req.flash('Error', 'User already taken');
        return res.redirect('/auth/signup');
      }
      const salt = bcrypt.genSaltSync(saltRounds);
      const hashedPassword = bcrypt.hashSync(password, salt);
      User.create({
        username,
        password: hashedPassword
      })
        .then((newUser) => {
          req.session.currentUser = newUser;
          res.redirect('/');
        })
        .catch(next);
    })
    .catch(next);
});

router.get('/login', (req, res, next) => {
  res.render('auth/login');
});

router.post('/login', authMiddleware.requireAnon, formMiddleware.requireFields, (req, res, next) => {
  const { username, password } = req.body;
  User.findOne({ username })
    .then((user) => {
      if (!user) {
        // req.flash('Error', 'User name or password incorrect');
        return res.redirect('/auth/login');
      }
      if (bcrypt.compareSync(password, user.password)) {
        req.session.currentUser = user;
        res.redirect('/');
      } else {
        res.redirect('/auth/login');
      }
    })
    .catch(next);
});

router.post('/logout', authMiddleware.requireUser, (req, res, next) => {
  delete req.session.currentUser;
  res.redirect('/auth/login');
});

module.exports = router;
