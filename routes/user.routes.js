const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const { Router } = require('express');
const User = require('../models/User.model');
const passport = require('passport');

const router = new Router();
const saltRounds = 10;

router.get('/sign-up', (req, res, next) => res.render('auth/signup'));

router.post('/sign-up', (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.render('auth/signup', {
      username,
      password,
      errorMessage:
        'All fields are mandatory. Please provide your username and password.',
    });
    return;
  }

  const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!regex.test(password)) {
    res.status(500).render('auth/signup', {
      username,
      errorMessage:
        'Password needs to have at least 6 chars and must contain at least one number, one lowercase and one uppercase letter.',
    });
    return;
  }

  bcrypt
    .genSalt(saltRounds)
    .then((salt) => bcrypt.hash(password, salt))
    .then((hashedPassword) => {
      return User.create({
        username,
        passwordHash: hashedPassword,
      })
        .then((newUserDB) => {
          req.session.currentUser = newUserDB;
          res.redirect('/profile');
        })
        .catch((error) => {
          if (error.code === 11000) {
            res.status(500).render('auth/signup', {
              errorMessage:
                'Username needs to be unique. Username is already used.',
            });
          } else {
            next(error);
          }
        });
    })
    .catch((error) => next(error));
});

router.get('/login', (req, res) => res.render('auth/login'));

router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, theUser, failureDetails) => {
    if (err) {
      return next(err);
    }

    if (!theUser) {
      res.render('auth/login', { errorMessage: 'Wrong password or username' });
      return;
    }

    req.login(theUser, (err) => {
      if (err) {
        return next(err);
      }
      req.session.currentUser = theUser;
      res.redirect('/profile');
    });
  })(req, res, next);
});


router.get('/profile', (req, res, next) => {
  res.render('users/profile', {
    userInSession: req.session.currentUser,
  });
});

router.post('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

router.get('/main', (req, res) => {
  if (!req.session.currentUser) {
    res.redirect('/login');
    return;
  }

  res.render('users/main', {
    userInSession: req.session.currentUser,
  });
});

router.get('/private', (req, res) => {
  if (!req.session.currentUser) {
    res.redirect('/login');
    return;
  }

  res.render('users/private', {
    userInSession: req.session.currentUser,
  });
});

module.exports = router;
