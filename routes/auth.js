const express = require('express');
const bcrypt = require('bcrypt');

const bcryptSalt = 10;
const User = require('../models/user.js');

const router = express.Router();

router.get('/signup', (req, res, next) => {
  res.render('signup');
});

router.post('/signup', (req, res, next) => {
  const { username, password } = req.body;
  const salt = bcrypt.genSaltSync(bcryptSalt);
  const encryptedPassword = bcrypt.hashSync(password, salt);

  if (!username || !password) {
    res.render('signup', { message: 'no empty fields' });
  } else {
    User.findOne({ username })
      .then((user) => {
        if (user) {
          res.render('signup', { message: 'username not available' });
        } else {
          User.create({ username, password: encryptedPassword });
          res.render('signup', { message: 'user created' });
        }
      })
      .catch((err) => {
        next(err);
      });
  }
});

router.get('/login', (req, res, next) => {
  res.render('login');
});

router.post('/login', (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    rest.render('login', { message: 'no empty fields' });
  } else {
    User.findOne({ username })
      .then((user) => {
        if (!user) {
          res.render('login', { message: 'incorrect username or password' });
        } else if (bcrypt.compareSync(password, user.password)) {
          req.session.currentUser = user;
          res.render('login', { message: 'logged in successfully' });
        } else {
          res.render('login', { message: 'incorrect username or password' });
        }
      })
      .catch((err) => {
        next(err);
      });
  }
});

router.post('/logout', (req, res, next) => {
  delete session.currentUser;
  res.redirect('login');
});

module.exports = router;
