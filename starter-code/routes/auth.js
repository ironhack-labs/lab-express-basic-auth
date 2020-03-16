const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const bcryptSalt = 10;
router.get('/signup', (req, res, next) => {
  res.render('auth/signup');
});
router.post('/signup', (req, res, next) => {
  const { username, password } = req.body;
  if (username === '' || password === '') {
    res.render('auth/signup', {
      errorMessage: 'Please provide a username and password to sign up'
    });
    return;
  }
  User.findOne({ username: username })
    .then(user => {
      if (user !== null) {
        res.render('auth/signup', {
          errorMessage: 'The username already exists!'
        });
        return;
      }
      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);
      User.create({ username, password: hashPass })
        .then(() => {
          res.redirect('/');
        })
        .catch(error => {
          console.log(error);
        });
    })
    .catch(error => {
      next(error);
    });
});
router.get('/login', (req, res, next) => {
  res.render('auth/login');
});
router.post('/login', (req, res, next) => {
  const theUserName = req.body.username;
  const thePassword = req.body.password;
  if (theUserName === '' || thePassword === '') {
    res.render('auth/login', {
      errorMessage: 'Please provide a username and password to log in'
    });
    return;
  }
  User.findOne({ username: theUserName })
    .then(user => {
      if (!user) {
        res.render('auth/login', {
          errorMessage: 'The username does not exist'
        });
        return;
      }
      if (bcrypt.compareSync(thePassword, user.password)) {
        req.session.currentUser = user;
        res.redirect('/main');
      } else {
        res.render('auth/login', {
          errorMessage: 'Incorrect password'
        });
      }
    })
    .catch(error => {
      next(error);
    });
});
router.get('/logout', (req, res, next) => {
  req.session.destroy(err => {
    // what happens when you don't have an active session
    res.redirect('/login');
  });
});
module.exports = router;