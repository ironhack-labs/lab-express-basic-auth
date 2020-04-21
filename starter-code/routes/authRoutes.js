const express = require('express');
const router = express.Router();
const User = require('../models/users');
const bcrypt = require('bcrypt');

// SIGNUP
router.get('/signup', (req, res, next) => {
  res.render('auth/signup.hbs');
});

router.post('/signup', (req, res, next) => {
  const { username, password } = req.body;

  if (username === '' || password === '') {
    res.render('auth/signup.hbs', {
      errorMessage: 'Indicate a username and a password to sign up',
    });
  }

  User.findOne({ username: username })
    .then((user) => {
      if (user !== null) {
        res.render('auth/signup.hbs', {
          errorMessage: 'The username already exists!',
        });
      } else {
        const bcryptSalt = 10;
        const salt = bcrypt.genSaltSync(bcryptSalt);
        const hashPass = bcrypt.hashSync(password, salt);
        const newUser = { username, password: hashPass };
        User.create(newUser)
          .then(() => res.redirect('/'))
          .catch((err) => console.log(err));
      }
    })
    .catch((err) => next(err));
});

// LOGIN
router.get('/login', (req, res, next) => {
  res.render('auth/login.hbs');
});

router.post('/login', (req, res, next) => {
  const { username, password } = req.body;

  if (username === '' || password === '') {
    res.render('auth/login.hbs', {
      errorMessage: 'Please enter both, username and password to sign up.',
    });
  }

  User.findOne({ username: username })
    .then((user) => {
      if (!user) {
        res.render('auth/login.hbs', {
          errorMessage: 'Invalid credentials',
        });
      }
      if (bcrypt.compareSync(password, user.password)) {
        req.session.currentUser = user;
        res.redirect('/');
      } else {
        res.render('auth/login.hbs', {
          errorMessage: 'Invalid credentials',
        });
      }
    })
    .catch((error) => {
      next(error);
    });
});

// LOGOUT
router.get('/logout', (req, res, next) => {
  req.session.destroy((err) => {
    res.redirect('/');
  });
});

module.exports = router;
