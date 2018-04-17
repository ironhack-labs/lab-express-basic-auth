'use strict';

const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const router = express.Router();
const bcryptSalt = 10;

// ---------- SIGN UP ---------- //

// ----- Get ----- //
router.get('/signup', (req, res, next) => {
  if (req.session.user) {
    return res.redirect('/');
  };
  res.render('pages/auth/signup');
});

// ----- Post ----- //
router.post('/signup', (req, res, next) => {
  if (req.session.user) {
    return res.redirect('/');
  };

  const username = req.body.username;
  const password = req.body.password;

  if (!username) {
    // PLEASE PROVIDE USERNAME
    return res.redirect('/auth/signup');
  };

  if (!password) {
    // PLEASE PROVIDE PASSWORD
    return res.redirect('/auth/signup');
  }

  User.findOne({ username: username })
    .then(result => {
      if (result) {
        // USERNAME ALREADY TAKEN
        return res.redirect('/auth/signup');
      } else {
        const salt = bcrypt.genSaltSync(bcryptSalt);
        const hashPass = bcrypt.hashSync(password, salt);

        const user = User({
          username,
          password: hashPass
        });
        user.save()
          .then(() => {
            req.session.user = user;
            // WELCOME <USERNAME> ESTE FLASH DEBERIA DESAPARECER CON EL TIEMPO (MAYBE SOME FRONT END JS???)
            return res.redirect('/');
          })
          .catch(next);
      };
    });
});

// ---------- LOGIN ---------- //

// ----- Get ----- //
router.get('/login', (req, res, next) => {
  if (req.session.user) {
    return res.redirect('/');
  };
  const data = { errorMessage: req.flash('loginError') };
  res.render('pages/auth/login', data);
});

// ----- Post ----- //
router.post('/login', (req, res, next) => {
  if (req.session.user) {
    return res.redirect('/');
  };
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({ username: username })
    .then(result => {
      if (!result) {
        req.flash('loginError', 'User can not be found');
        return res.redirect('/auth/login');
      } else if (bcrypt.compareSync(password, result.password)) {
        req.session.user = result;
        return res.redirect('/');
      } else {
        req.flash('loginError', 'Username or password are incorrect');
        return res.redirect('/auth/login');
      }
    })
    .catch(next);
});

// ---------- LOGOUT ---------- //

router.post('/logout', (req, res, next) => {
  delete req.session.user;
  return res.redirect('/');
});

module.exports = router;
