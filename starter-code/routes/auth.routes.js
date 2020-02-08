const express = require('express');
const router  = express.Router();
const mongoose = require('mongoose');

// BCrypt to encrypt passwords
const bcryptjs = require("bcrypt");
const saltRounds = 10;

// User model
const User = require('../models/User.model');

const routeGuard = require('../config/route-guard.config');

/* GET Signup page */
router.get('/signup', (req, res, next) => {
  res.render('auth/signup');
});

// .post() route ==> to process form data
router.post('/signup', (req, res, next) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    res.render('auth/signup', { errorMessage: 'All fields are mandatory. Please provide your username, email and password.' });
    return;
  }

  const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!regex.test(password)) {
    res
      .status(500)
      .render('auth/signup', { errorMessage: 'Password needs to have at least 6 chars and must contain at least one number, one lowercase and one uppercase letter.' });
    return;
  }

  bcryptjs
    .genSalt(saltRounds)
    .then(salt => bcryptjs.hash(password, salt))
    .then(hashedPassword => {
      // console.log(`Password hash: ${hashedPassword}`)
      return User.create({
        // username: username
        username,
        email,
        passwordHash: hashedPassword
      })
        .then(user => res.render('users/user-profile', { user }))
        .catch(err => {
          if (err instanceof mongoose.Error.ValidationError) {
            // console.log(`err: ====> `, err);
            res.status(500).render('auth/signup', { errorMessage: err.message });
          } else if (err.code === 11000) {
            res.status(500).render('auth/signup', {
              errorMessage: 'Username and email need to be unique. Either username or email is already used.'
            });
          } else {
            next(err);
          }
        });
    })
    .catch(err => next(err));
});

// login

router.get('/login', (req, res) => res.render('auth/login'));

router.post('/login', (req, res, next) => {
  // console.log('SESSION =====> ', req.session);
  const { email, password } = req.body;

  if (!email || !password) {
    res.render('auth/signup', { errorMessage: 'All fields are mandatory. Please provide your both, email and password.' });
    return;
  }

  // email: email
  User.findOne({ email })
    .then(user => {
      if (!user) {
        res.render('auth/login', { errorMessage: 'Email is not registered. Try with other email.' });
        return;
      } else if (bcryptjs.compareSync(password, user.passwordHash)) {
        // res.render('users/user-profile', { user });
        req.session.currentUser = user;
        res.redirect('/userProfile');
      } else {
        res.render('auth/login', { errorMessage: 'Incorrect password.' });
      }
    })
    .catch(err => next(err));
});

// logout

router.post('/logout', routeGuard, (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

router.get('/userProfile', routeGuard, (req, res) => {
  // console.log('USER IN SESSION: ', req.session.currentUser);
  res.render('users/user-profile');
});

module.exports = router;
