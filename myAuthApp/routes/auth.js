'use strict';
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

const User = require('../models/user');

const bcryptSalt = 10;

/* GET users listing. */

router.get('/signup', (req, res, next) => {
  if (req.session.currentUser) {
    res.redirect('/main');
    return;
  }
  res.render('../views/signup');
});
router.post('/signup', (req, res, next) => {
  if (req.session.currentUser) {
    res.redirect('/main');
    return;
  }
  User.findOne({username: req.body.username})
    .then((result) => {
      if (result) {
        console.log('username in use');
        res.redirect('/signup');
      } else {
        // ENCRIPTING THE PASSWORD
        const salt = bcrypt.genSaltSync(bcryptSalt);
        const hashPass = bcrypt.hashSync(req.body.password, salt);

        const newUser = new User({
          username: req.body.username,
          password: hashPass
        });

        newUser.save()
          .then((user) => {
            req.session.currentUser = user;
            res.redirect('/main');
          })
          .catch(next);
      }
    })
    .catch(next);
});

router.get('/login', (req, res, next) => {
  if (req.session.currentUser) {
    res.redirect('/main');
    return;
  }
  res.render('../views/login.hbs');
});
router.post('/login', (req, res, next) => {
  if (req.session.currentUser) {
    res.redirect('/main');
    return;
  }
  User.findOne({username: req.body.username})
    .then((result) => {
      console.log(result);
      if (!result) {
        return res.redirect('/login');
      }
      // --comparing the password
      if (bcrypt.compareSync(req.body.password, result.password)) {
        req.session.currentUser = result;
        res.redirect('/main');
      } else {
        console.log('incorect password');
        res.redirect('/login');
      }
    })
    .catch(next);
});

router.get('/main', (req, res, next) => {
  if (req.session.currentUser) {
    res.render('../views/main.hbs');
  } else {
    res.redirect('/');
  }
});

router.get('/private', (req, res, next) => {
  if (req.session.currentUser) {
    res.render('../views/private.hbs');
  } else {
    res.redirect('/');
  }
});

router.post('/logout', (req, res, next) => {
  req.session.currentUser = null;
  res.redirect('/');
});
module.exports = router;
