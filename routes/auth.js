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

  User.findOne({ username }).then((user) => {
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

router.get('/login', (req, res, next) => {
  res.render('login');
});

router.post('/login', (req, res, next) => {
  const { username, password } = req.body;

  if (!password || !username) {
    return res.render('login', {
      message: 'Please enter an Username and a Password',
    });
  }

  User.findOne({ username }).then((user) => {
    if (user) {
      if (bcrypt.compareSync(password, user.password)) {
        req.session.user = user;
        res.redirect('/profile');
        //probably unecessary but better be safe than sorry !
        return;
      }
    }
    return res.render('login', { message: 'Wrong credentials' });
  });
});

router.get('/logout', (req, res, next) => {
  req.session.destroy((err) => {
    res.redirect('/');
  });
});

module.exports = router;
