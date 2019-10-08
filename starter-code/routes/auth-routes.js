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

module.exports = router;
