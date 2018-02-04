'use strict';

const express = require('express');
const authRoutes = express.Router();
const User = require('../models/user');

authRoutes.get('/signup', (req, res, next) => {
  res.render('auth/signup');
});

authRoutes.get('/login', (req, res, next) => {
  res.render('auth/login');
});

// BCrypt to encrypt passwords
const bcrypt = require('bcrypt');
const bcryptSalt = 10;

authRoutes.post('/signup', (req, res, next) => {
  var username = req.body.username;
  var password = req.body.password;
  var salt = bcrypt.genSaltSync(bcryptSalt);
  var hashPass = bcrypt.hashSync(password, salt);

  var newUser = User({
    username,
    password: hashPass
  });

  newUser.save((err) => {
    res.redirect('/');
  });
});

authRoutes.post('/login', (req, res, next) => {
  var username = req.body.username;
  var password = req.body.password;

  if (username === '' || password === '') {
    res.render('auth/login', {
      message: 'Indicate a username and a password to sign up'
    });
    return;
  }

  User.findOne({ 'username': username }, (err, user) => {
    if (err || !user) {
      res.render('auth/login', {
        message: "The username doesn't exist"
      });
      return;
    }
    if (bcrypt.compareSync(password, user.password)) {
      // Save the login in the session!
      req.session.currentUser = user;
      res.redirect('/');
    } else {
      res.render('auth/login', {
        message: 'Incorrect password'
      });
    }
  });
});

module.exports = authRoutes;
