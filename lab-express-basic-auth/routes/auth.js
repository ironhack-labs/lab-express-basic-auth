const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

const User = require('../models/users');

router.get('/signup', function (req, res, next) {
  res.render('auth/signup', { title: 'Express' });
});

router.post('/signup', function (req, res, next) {
  const username = req.body.username;
  const password = req.body.password;
  // Check if user is logged in

  // Check if username and password params have been sent
  if (!username || !password) {
    res.redirect('/auth/signup');
    return;
  }

  // Check if user exists
  User.findOne({ username: username })
    .then(user => {
      if (user) {
        // Username exists
        res.redirect('/auth/signup');
      } else {
        // Username doesn't exist, create the user
        const newUser = new User({ username: username, password: password });
        newUser.save();
        res.render('auth/signup', { title: 'Express' });
      }
    });
});

router.get('/login', function (req, res, next) {
  res.render('auth/login', { title: 'Express' });
});

module.exports = router;
