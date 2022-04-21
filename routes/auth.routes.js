const router = require('express').Router();
const bcryptjs = require('bcryptjs');
const saltRounds = 10;
const { isLoggedIn, isLoggedOut } = require('../middleware/route-guard.js');

const User = require('../models/User.model');
const mongoose = require('mongoose');

router.get('/signup', isLoggedOut, (req, res, next) => {
  res.render('auth/signup.hbs');
});

router.post('/signup', (req, res, next) => {
  const { username, password } = req.body;
  bcryptjs
    .genSalt(saltRounds)
    .then((salt) => bcryptjs.hash(password, salt))
    .then((password) => {
      console.log(`password secured`, password);
    });
  User.create({ username, password }).then((userfromDB) => {
    console.log('new user', userfromDB);
    res.redirect('signup');
  });
});

router.get('/login', isLoggedOut, (req, res, next) => res.render('auth/login'));

router.get('/userProfile', isLoggedIn, (req, res, next) => {
  console.log(req.session);
  res.render('users/user-profile', { userInSession: req.session.currentUser });
});

router.post('/login', isLoggedOut, (req, res, next) => {
  const { username, password } = req.body;

  User.findOne({ username })
    .then((user) => {
      bcryptjs.compareSync(password, user.password);
      req.session.currentUser = user;
      res.redirect('/userProfile');
    })
    .catch((error) => next(error));
});

router.get('/main', isLoggedIn, (req, res, next) => {
  res.render('random/cat');
});

router.get('/private', isLoggedIn, (req, res, next) => {
  res.render('random/gif');
});

module.exports = router;
