const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');

const User = require('../models/users');

const saltRounds = 10;

router.get('/signup', function (req, res, next) {
  // Check if user is logged in
  if (req.session.currentUser) {
    return res.redirect('/');
  }
  res.render('auth/signup', { title: 'Express' });
});

router.post('/signup', (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  // Check if user is logged in
  if (req.session.currentUser) {
    return res.redirect('/');
  }

  // Check if username and password params have been sent
  if (!username || !password) {
    console.log('username or password param not supplied');
    res.redirect('/auth/signup');
    return;
  }

  // Check if user exists
  User.findOne({ username: username })
    .then((user) => {
      if (user) {
        // Username exists
        console.log(err);
        return res.redirect('/auth/signup');
      } else {
        // Username doesn't exist, create the user
        console.log('username doesnt exist. creating user');
        const salt = bcrypt.genSaltSync(saltRounds);
        const hash = bcrypt.hashSync(password, salt);
        const newUser = new User({ username: username, password: hash });
        newUser.save();
        res.redirect('/');
      }
    })
    .catch(err => {
      console.log(err);
      next();
    });
});

router.get('/login', function (req, res, next) {
  // Check if user is logged in
  if (req.session.currentUser) {
    return res.redirect('/');
  }
  res.render('auth/login', { title: 'Express' });
});

router.post('/login', (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  // Check if user is logged in
  if (req.session.currentUser) {
    return res.redirect('/');
  }

  // Check if username and password params have been sent
  if (!username || !password) {
    console.log('username or password param not supplied');
    res.redirect('/auth/login');
    return;
  }
  // Check if user exists
  User.findOne({ username: username })
    .then((user) => {
      if (!user) {
        // User doesn't exist
        console.log('username does not exist in db');
        res.redirect('/auth/login');
      }
      if (bcrypt.compareSync(password, user.password)) {
        console.log('log in successful');
        // Save session info
        req.session.currentUser = user;
        res.redirect('/');
      }
    })
    .catch(err => {
      console.log(err);
      next();
    });
});

router.get('/logout', (req, res, next) => {
  // Check that the user is logged in
  if (!req.session.currentUser) {
    return res.redirect('/');
  };

  req.session.destroy((err) => {
    if (err) {
      console.log(err);
      next();
    }
    res.redirect('/auth/login');
  });
});

module.exports = router;
