/*jshint esversion: 6*/
const bcrypt = require('bcrypt');
const bcryptSalt = 10;
const User = require('../models/userModels');
const express = require('express');
const router = express.Router();

//Route to the signup page
router.get('/signup', (req, res, next) => {
  res.render('autherise/signup');
});

router.post('/signup', (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username === '' || password === '') {
    res.render('autherise/signup', {
      errorMessage: "Please enter a username and password to sign up."
    });
    return;
  }

  User.findOne({ 'username': username },
    'username',
    (err, user) => {
      if (user !== null) {
        res.render('autherise/signup', {
          errorMessage: "The username already exists."
        });
        return;
      }
      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);

      const newUser = new User({
        username: username,
        password: hashPass,
      });
      newUser.save((err) => {
        if (err) { return next(err); }
        res.redirect('/');
      });
    });
});

router.get('/login', (req, res, next) => {
  res.render('autherise/login');
});

router.post('/login', (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username === '' || password === '') {
    res.render('autherise/signup', {
      errorMessage: "Please enter a username and password to sign up."
    });
    return;
  }

  User.findOne({ 'username': username }, (err, user) => {
    if (err || !user) {
      res.render('autherise/login', {
        errorMessage: "The username doesn't exist."
      });
      return;
    }
    if (bcrypt.compareSync(password, user.password)) {
      req.session.currentUser = user;
      res.redirect('/secret');
    }
    else {
      res.render('autherise/login', {
        errorMessage: "Incorrect password"
      });
    }
  });

});

router.get('/logout', (req, res, next) => {
  req.session.destroy((err) => {
    res.redirect('/');
  });
});

module.exports = router;
