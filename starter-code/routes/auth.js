const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

const User = require('../models/User');

//Iteration 1 - Sign Up

router.get('/signup', (req, res) => {
  res.render('signup');
});

router.post('/signup', (req, res, next) => {
  const { username, password } = req.body;
  if (password.length < 8) {
    res.render('signup', {
      message: 'Your password must be 8 characters minimum',
    });
    return;
  }
  if (username === '') {
    res.render('signup', { message: 'Your username cannot be empty' });
    return;
  }
  // check if username already exists
  User.findOne({ username: username }).then((found) => {
    if (found !== null) {
      res.render('signup', { message: 'Username is already taken' });
    } else {
      const salt = bcrypt.genSaltSync();
      const hash = bcrypt.hashSync(password, salt);

      User.create({ username: username, password: hash })
        .then((dbUser) => {
          // login the user
          res.redirect('/login');
        })
        .catch((err) => {
          next(err);
        });
    }
  });
});

//Iteration 2 - Login

router.get('/login', (req, res) => {
  res.render('login');
});

router.post('/login', (req, res, next) => {
  const { username, password } = req.body;
  User.findOne({ username: username }).then((found) => {
    if (found === null) {
      // no user has this username
      res.render('login', { message: 'Invalid credentials' });
      return;
    }
    if (bcrypt.compareSync(password, found.password)) {
      // password and hash match
      req.session.user = found;
      res.redirect('/private');
    } else {
      res.render('login', { message: 'Invalid credentials' });
    }
  });
});

module.exports = router;
