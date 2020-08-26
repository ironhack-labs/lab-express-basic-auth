"use strict";

var express = require('express');

var router = express.Router();

var User = require("../models/User.model");

var bcryptjs = require('bcryptjs');

var saltRounds = 10;
/* GET signup page */

router.get('/signup', function (req, res, next) {
  return res.render('signup');
}); // POST signup page 

router.post('/signup', function (req, res, next) {
  var _req$body = req.body,
      username = _req$body.username,
      password = _req$body.password;
  bcryptjs.genSalt(saltRounds).then(function (salt) {
    return bcryptjs.hash(password, salt);
  }).then(function (hashedPassword) {
    return User.create({
      username: username,
      passwordHash: hashedPassword
    });
  }).then(function (userFromDB) {
    console.log('Newly created user is: ', userFromDB);
  })["catch"](function (error) {
    return next(error);
  });
});
router.get('/login', function (req, res, next) {
  return res.render("login");
});
router.post('/login', function (req, res, nex) {
  console.log('SESSION =====> ', req.session);
  var _req$body2 = req.body,
      username = _req$body2.username,
      password = _req$body2.password;

  if (username === '' || password === '') {
    res.render("login", {
      errorMessage: 'Please enter both, username and password to login.'
    });
    return;
  }

  User.findOne({
    username: username
  }).then(function (user) {
    if (!username) {
      res.render('login', {
        errorMessage: 'Please enter correct username to login.'
      });
      return;
    } else if (bcryptjs.compareSync(password, user.passwordHash)) {
      req.session.currentUser = user;
      res.redirect('user-profile');
    } else {
      res.render('login', {
        errorMessage: 'Incorrect password.'
      });
    }
  })["catch"](function (error) {
    return next(error);
  });
});
router.get('/profile', function (req, res, next) {
  res.render('user-profile', {
    userInSession: req.session.currentUser
  });
});
module.exports = router;