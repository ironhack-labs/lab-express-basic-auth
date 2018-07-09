'use strict';

const User = require('../models/user');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const bcryptSalt = 10;
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

/* GET sign up page. */
router.get('/', (req, res, next) => {
  return res.render('auth/signup');
});

router.post('/', (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const salt = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(password, salt);

  // IF i uncomment the following code an error will occurs if the user don't provide
  // a username and password but instead it should redirect to signup page as the if statement is telling :(

  // if (req.session.currentUser) {
  //   res.redirect('/');
  //   return;
  // }

  if (!req.body.username || req.body.password) {
    res.redirect('/signup');
    return;
  }

  const newUser = User({
    username: username,
    password: hashPass
  });

  newUser.save()
    .then(user => {
      req.session.currentUser = newUser;
      res.redirect('/'); // here i can put /paquito this is not redirecting to paquito I don't know why
    });
});

module.exports = router;
