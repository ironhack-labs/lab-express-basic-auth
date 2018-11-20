const express = require('express');
const router = express.Router();
const User = require('../models/user');
const authMiddleware = require('../middleware/authMiddleware');
const formMiddleware = require('../middleware/formMiddleware');

const bcrypt = require('bcrypt');
const saltRounds = 10;

/* LOG IN */
router.get('/login', authMiddleware.requireAnon, (req, res, next) => {
  const data = {
    messages: req.flash('error')
  };
  res.render('auth/login', data);
});

router.post('/login', authMiddleware.requireAnon, formMiddleware.requireField, (req, res, next) => {
  const { username, password } = req.body;
  User.findOne({ username })
    .then((user) => {
      if (!user) {
        // account doesn't exist
        req.flash('error', 'Account does not exist');
        return res.redirect('/auth/login');
      } if (bcrypt.compareSync(password, user.password)) {
        req.session.currentUser = user;
        res.redirect('/');
      } else {
        // wrong password
        req.flash('error', 'Wrong password or username');
        res.redirect('/auth/login');
      }
    })
    .catch();
});

// SIGN UP
router.get('/signup', (req, res, next) => {
  const data = {
    messages: req.flash('error')
  };
  res.render('auth/signup', data);
});

router.post('/signup', authMiddleware.requireAnon, formMiddleware.requireField, (req, res, next) => {
  const { username, password } = req.body;

  User.findOne({ username })
    .then((user) => {
      if (user) {
      // username already exists
        req.flash('error', 'Username already exists');
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
          res.redirect('/auth/signup');
        })
        .catch(next);
    })
    .catch(next);
});

module.exports = router;
