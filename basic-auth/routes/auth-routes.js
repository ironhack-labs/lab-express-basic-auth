'use strict';
const express = require('express');
const authRoutes = express.Router();

// User model
const User = require('../models/user');

// BCrypt to encrypt passwords
const bcrypt = require('bcrypt');
const bcryptSalt = 10;

/* GET users listing. */
authRoutes.get('/signup', (req, res, next) => {
  if (req.session.currentUser) {
    return res.redirect('/');
  }
  res.render('auth/signup');
});

authRoutes.post('/signup', (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const salt = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(password, salt);

  const newUser = new User({
    username,
    password: hashPass
  });

  if (!username && !password) {
    res.render('auth/signup', {
      errorMessage: 'Indicate a username and a password to sign up'
    });
  } else if (username === '') {
    res.render('auth/signup', {
      errorMessage: 'Indicate a username to sign up'
    });
  } else if (password === '') {
    res.render('auth/signup', {
      errorMessage: 'Indicate a password to sign up'
    });
  }

  User.findOne({ 'username': username })
    .then(user => {
      if (user) {
        res.render('auth/signup', {
          errorMessage: 'The username already exists'
        });
      } else {
        newUser.save()
          .then(user => {
            req.session.currentUser = newUser;
            return res.redirect('/home');
          });
      }
    })
    .catch(error => {
      next(error);
    });
});

// ---------- Login Routes ---------- //
authRoutes.get('/login', (req, res, next) => {
  res.render('auth/login');
});

authRoutes.post('/login', (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username && !password) {
    res.render('auth/login', {
      errorMessage: 'Indicate a username and a password to sign up'
    });
  } else if (!username) {
    res.render('auth/login', {
      errorMessage: 'Indicate a username to sign up'
    });
  } else if (!password) {
    res.render('auth/login', {
      errorMessage: 'Indicate a password to sign up'
    });
  }

  User.findOne({ 'username': username }, (err, user) => {
    if (err || !user) {
      res.render('auth/login', {
        errorMessage: "The username doesn't exist"
      });
    }
    if (bcrypt.compareSync(password, user.password)) {
      req.session.currentUser = user;
      return res.redirect('/');
    } else {
      res.render('auth/login', {
        errorMessage: 'Incorrect password'
      });
    }
  });
});

authRoutes.get('/logout', (req, res, next) => {
  delete req.session.currentUser;
  // req.session.currentUser = null;
  // req.session.destroy((err) => {
  //   res.redirect('/login');
  // });
});

module.exports = authRoutes;
