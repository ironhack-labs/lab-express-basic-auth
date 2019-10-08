const express = require('express');
const router  = express.Router();

// User model
const User = require('../models/user');

// Encrypt password
const bcrypt = require('bcrypt');
const bcryptSalt = 10;

// Sign up
router.get('/signup', (req, res, next) => {
  res.render('auth/signup');
});

router.post('/signup', (req, res) => {
  console.log(req.body);

  const username = req.body.username;
  const password = req.body.password;

  // The fields can't be empty
  if (username === '' || password === '') {
    res.render('auth/signup', {
      errorMessage: 'Indicate a username and a password to sign up'
    });
    return;
  }

  User.findOne({ 'username': username })
    .then(user => {
      // Username can't be repeated
      if (user !== null) {
        res.render('auth/signup', {
          errorMessage: 'The username already exists!'
        });
        return;
      }

      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);

      User.create({
        username,
        password: hashPass
      })
      .then(() => {
        res.redirect('/')
      })
      .catch(error => { console.log(error) });
    })
    .catch(error => { next(error) });
});

// Login
router.get('/login', (req, res) => {
  res.render('auth/login');
});

router.post('/login', (req, res) => {
  const theUsername = req.body.username;
  const thePassword = req.body.password;

  // The fields can't be empty
  if (theUsername === '' || thePassword === '') {
    res.render('auth/login', {
      errorMessage: 'Please enter both, username and password to log in'
    });
    return;
  }

  User.findOne({ 'username': theUsername })
    .then(user => {
      // Username must exist in the DB
      if (!user) {
        res.render('auth/login', {
          errorMessage:'The username doesn\'t exists'
        });
        return;
      }
      if (bcrypt.compareSync(thePassword, user.password)) {
        // Save the login in the session
        req.session.currentUser = user;
        res.redirect('/')
      } else {
        res.render('auth/login', {
          errorMessage: 'Incorrect password'
        });
      }
    })
    .catch(error => { next(error) });
});

// Logout
router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    res.redirect('/login');
  });
});

module.exports = router;
