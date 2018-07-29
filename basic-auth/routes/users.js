const express = require('express');
const bcrypt = require('bcrypt');

const router = express.Router();
const saltRounds = 10;

const User = require('../models/user');

router.get('/signup', (req, res) => {
  const msg = { error: req.flash('error') };
  res.render('signup', msg);
});

router.post('/signup', (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) { // without user or pwrd
    req.flash('error', 'Username and Password are required');
    res.redirect('/auth/signup');
  } else {
    User.findOne({ username })
      .then((user) => {
        if (user) {
          req.flash('error', 'Username exist');
          res.redirect('/auth/signup');
        } else {
          const salt = bcrypt.genSaltSync(saltRounds);
          const hashedPassword = bcrypt.hashSync(password, salt);
          User.create({ username, password: hashedPassword })
            .then((newUser) => {
              console.log(`${newUser.username} as created`);
              res.redirect('/auth/login');
            })
            .catch((error) => {
              next(error);
            });
        }
      })
      .catch((error) => {
        next(error);
      });
  }
});

router.get('/login', (req, res) => {
  const msg = { error: req.flash('error') };
  res.render('login', msg);
});

router.post('/login', (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) { // without user or pwrd
    req.flash('error', 'Username and Password are required');
    res.redirect('/auth/login');
  } else {
    User.findOne({ username })
      .then((user) => {
        if (user) {
          if (bcrypt.compareSync(password, user.password)) {
            req.session.currentUser = username;
            res.redirect('/');
          }
        } else {
          req.flash('error', 'Username or Password incorrect');
          res.redirect('/auth/login');
        }
      })
      .catch((error) => {
        next(error);
      });
  }
});

router.post('/logout', (req, res) => {
  delete req.session.currentUser;
  res.redirect('/');
});

module.exports = router;
