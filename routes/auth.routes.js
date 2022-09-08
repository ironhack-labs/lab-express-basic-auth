const express = require('express');
const User = require('../models/User.model');
const bcryptjs = require('bcryptjs');
const router = express.Router();

// Creating routes
router.get('/signup', (req, res) => {
  res.render('auth/signup');
});

// Creating post routes
router.post('/signup', (req, res) => {
  const {username, password} = req.body;
  const saltRounds = 10;
  bcryptjs
    .genSalt(saltRounds)
    .then((salt) => bcryptjs.hash(password, salt))
    .then((passwordHash) => {
      return User.create({
        username: username,
        password: passwordHash
      });
    })
    .then((userBD) => {
      console.log('New user created: ', userBD)
    })
    .catch((err) => console.log(err));
});

module.exports = router;