const express = require('express');
const bcrypt = require('bcrypt');

const bcryptSalt = 10;
const User = require('../models/user.js');

const router = express.Router();

router.get('/signup', (req, res, next) => {
  res.render('auth/signup');
});

router.post('/signup', (req, res, next) => {
  const { username, password } = req.body;
  const salt = bcrypt.genSaltSync(bcryptSalt);
  const encryptedPassword = bcrypt.hashSync(password, salt);

  if (!username || !password) {
    req.flash('info', 'All fields all required!');
    res.redirect('auth/signup');
  } else {
    User.findOne({ username })
      .then((user) => {
        if (user) {
          req.flash('info', 'Username is not available!');
          res.redirect('auth/signup');
        } else {
          User.create({ username, password: encryptedPassword });
          req.flash('info', 'User created');
          res.redirect('/');
        }
      })
      .catch((err) => {
        next(err);
      });
  }
});

router.get('/login', (req, res, next) => {
  res.render('auth/login');
});

router.post('/login', (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    req.flash('info', 'All fields are required!');
    res.redirect('auth/login');
  } else {
    User.findOne({ username })
      .then((user) => {
        if ((user) && (bcrypt.compareSync(password, user.password)))  {
          req.session.currentUser = user;
          res.redirect('/');
        } else {
          req.flash('info', 'Incorrect username or password!');
          res.redirect('auth/login');
        }
      })
      .catch((err) => {
        next(err);
      });
  }
});

router.post('/logout', (req, res, next) => {
  delete req.session.currentUser;
  res.redirect('login');
});

module.exports = router;
