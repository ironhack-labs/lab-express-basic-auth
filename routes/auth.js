const express = require("express");
const router = express.Router();
const User = require('../models/User.model');
const bcrypt = require('bcrypt');

router.get('/signup', (req, res) => {
  res.render('signup');
});

router.get('/login', (req, res) => {
  res.render('login');
});

router.post('/signup', (req, res, next) => {
  const { username, password } = req.body;
  if (password.length < 8) {
    res.render('signup', { message: 'password has to be 8 characters  minimum' });
    return;
  }
  if (username === '') {
    res.render('signup', { message: 'username cannot be empty' });
    return;
  }
  User.findOne({ username: username }).then(found => {
    if (found !== null) {
      res.render('signup', { message: 'Username is already taken' });
    } else {
      const salt = bcrypt.genSaltSync();
      const hash = bcrypt.hashSync(password, salt)
      User.create({ username: username, password: hash })
        .then(dbUser => {
          req.session.user = dbUser;
          res.redirect('/private')
        })
        .catch(err => {
          next(err);
        })
    }
  })
})
router.post('/login', (req, res, next) => {
  const { username, password } = req.body;
  if (password.length < 8) {
    res.render('login', { message: 'Your password has to be 8 characters  minimum' });
    return;
  }
  if (username === '') {
    res.render('login', { message: 'Your username cannot be empty' });
    return;
  }
  User.findOne({ username: username }).then(userFromDB => {
    if (userFromDB === null) {
      res.render('login', { message: 'Invalid credentials' });
      return;
    }
    if (bcrypt.compareSync(password, userFromDB.password)) {
      req.session.user = userFromDB;
      res.redirect('/private');
    } else {
      res.render('login', { message: 'Invalid credentials' });
    }
  })
});
module.exports = router;