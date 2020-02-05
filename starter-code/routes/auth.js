const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');

router.get('/login', (req, res, next) => {
  res.render('auth/login');
});

router.get('/signup', (req, res, next) => {
  res.render('auth/signup');
});

router.get('/logout', (req, res, next) => {
  req.session.destroy();
  res.redirect('/');
});

router.post('/login', (req, res, next) => {
  const { username, password } = req.body;

  let user;

  User.findOne({ username })
    .then((foundUser) => {
      if (!foundUser) {
        res.render('auth/login', { errorMessage: 'Credential are not valid!' });
        return;
      }

      user = foundUser;
      return bcrypt.compare(password, foundUser.password);
    })
    .then((match) => {
      console.log('BCrypt compare: ', match);

      if (!match) {
        res.render('auth/login', { errorMessage: 'Invalid credentials' });
        return;
      }

      req.session.user = { username, password };
      res.redirect('/private');
      return;
    })
    .catch((err) => next(err));
});

router.post('/signup', (req, res, next) => {
  const { username, password } = req.body;
  //create user

  if (!username) {
    res.render('auth/signup', { errorMessage: 'Username cannot be empty' });
    return;
  }

  if (password.length < 6) {
    res.render('auth/signup', {
      errorMessage: 'Password has to include more than 6 characters',
    });
    return;
  }

  User.findOne({ username })
    .then((result) => {
      console.log(result);
      if (result) {
        res.render('auth/signup', { errorMessage: 'Username already taken!' });
        return;
      }
      return bcrypt.hash(password, 10);
    })
    .then((hash) => {
      return User.create({ username, password: hash });
    })
    .then((user) => {
      console.log(`created user: ${user}`);
      res.redirect('/login');
      return;
    })
    .catch((err) => next(err));
});

module.exports = router;
