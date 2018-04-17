'use strict';

var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const User = require('../modules/userdata');

// BCrypt to encrypt passwords

const bcrypt = require('bcrypt');
const bcryptSalt = 10;

// -- Connect to mongoose

mongoose.Promise = Promise;
mongoose.connect('mongodb://localhost/cookie-starter', {
  keepAlive: true,
  reconnectTries: Number.MAX_VALUE
});

/* GET home page. */

router.get('/', (req, res, next) => {
  res.render('auth/sign-up', { title: 'Express' });
});

router.get('/auth/sign-up', (req, res, next) => {
  res.render('auth/sign-up', { title: 'Express' });
});

router.post('/new-user', (req, res, next) => {
  const name = req.body.name;
  const email = req.body.email;
  const username = req.body.username;
  const password = req.body.password;
  const salt = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(password, salt);

  User.findOne({username: username})
    .then(user => {
      if (!user) {
        return res.redirect('/auth/login');
      } else if (user === username) {
        return res.redirect('/auth/login');
      } else {
        const user = new User({
          name,
          email,
          username,
          password: hashPass });
        user.save()
          .then(() => {
            res.redirect(`/starter-page`);
          });
      }
    })
    .catch(next);
});

router.get('/starter-page', (req, res, next) => {
  res.render('starter-page', { title: 'Express' });
});

router.get('/auth/login', (req, res, next) => {
  res.render('auth/login', { title: 'Express' });
});

router.post('/member', (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({ username: username })
    .then(user => {
      if (!user) {
        return res.redirect('/auth/login');
      } else if (bcrypt.compareSync(password, user.password)) {
        req.session.user = user;
        return res.redirect('/starter-page');
      } else {
        return res.redirect('/auth/login');
      }
    })
    .catch(next);
});

module.exports = router;
