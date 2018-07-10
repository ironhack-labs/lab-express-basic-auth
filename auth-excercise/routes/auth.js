'use strict';

const express = require('express');
const router = express.Router();
const User = require('../models/signup');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;

mongoose.Promise = Promise;
mongoose.connect('mongodb://localhost/auth-collection', {
  keepAlive: true,
  reconnectTries: Number.MAX_VALUE
});

// -------- GET users
router.get('/signup', (req, res, next) => {
  res.render('signup');
});

// -------- POST users

router.post('/signup', (req, res, next) => {
  if (req.session.currentUser) {
    res.redirect('/');
  }
  if (req.body.username || req.body.password) {
    res.redirect('signup');
  }
  User.findOne({ username: req.body.username })
    .then((user) => {
      res.redirect('signup');
    })
    .catch(next);

  const salt = bcrypt.genSaltSync(saltRounds);
  const hashedPassword = bcrypt.hashSync(req.body.password, salt);

  const newUser = new User({
    username: req.body.username,
    password: hashedPassword
  });
  newUser.save();
  req.session.currentUser = newUser
    .then(() => {
      res.redirect('/');
    })
    .catch(next);
});
module.exports = router;
