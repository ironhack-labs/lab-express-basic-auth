const router = require('express').Router();
const User = require('../models/User.model');
const bcrypt = require('bcrypt');

router.get('/signup', (req, res, next) => {
  res.render('signup');
});

router.post('/signup', (req, res, next) => {
  const { username, password } = req.body;

  if (!password || !username) {
    return res.render('signup', {
      message: 'Please enter an Username and a Password',
    });
  }

  if (password.length < 8) {
    return res.render('signup', {
      message: 'Your password has to be 8 chars min',
    });
  }

  User.findOne({ username: username }).then((user) => {
    if (user) {
      return res.render('signup', {
        message: 'This username is already taken',
      });
    } else {
      const salt = bcrypt.genSaltSync();
      const hash = bcrypt.hashSync(password, salt);
      User.create({ username, password: hash }).then((_) => res.redirect('/'));
    }
  });
});

module.exports = router;
