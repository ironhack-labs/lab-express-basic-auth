const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

const User = require('../models/users');

router.get('/signup', function (req, res, next) {
  const newUser = new User({ username: 'foo', password: 'bar' });
  newUser.save();
  res.render('auth/signup', { title: 'Express' });
});

router.get('/login', function (req, res, next) {
  res.render('auth/login', { title: 'Express' });
});

module.exports = router;
