const express = require('express');
const router = express.Router();
const User = require('../models/user');

// BCrypt to encrypt passwords
const bcrypt = require('bcrypt');
const bcryptSalt = 10;

router.get('/signup', (req, res, next) => {
  res.render('auth/signup');
});

router.post('/signup', (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username === '' || password === '') {
    res.render('auth/signup', {
      errorMessage: 'Indicate a username and a password to sign up',
    });
    return;
  }

  const salt = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(password, salt);

  const newUser = User({
    username: username,
    password: hashPass,
  });

  newUser.save(err => {
    res.redirect('/');
  });
});

router.get('/login', (req, res, next) => {
  res.render('auth/login');
});

router.post('/login', (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username === '' || password === '') {
    res.render('auth/login', {
      errorMessage: 'Indicate a username and a password to sign up',
    });
    return;
  }
  User.findOne({ username: username }, (err, user) => {
    if (err || !user) {
      res.render('auth/login', {
        errorMessage: "The username doesn't exist",
      });
      return;
    }
    if (bcrypt.compareSync(username, user.password)) {
      // Save the login in the session!
      console.log('correct');
      req.session.currentUser = user;
      res.redirect('/secreti');
    } else {
      res.render('auth/login', {
        errorMessage: 'Incorrect password',
      });
    }
  });
});

module.exports = router;
