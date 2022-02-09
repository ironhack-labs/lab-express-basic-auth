const router = require('express').Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User.js');

router.get('/signup', (req, res, next) => {
  res.render('auth/signup', {});
});

router.post('/signup', (req, res, next) => {
  const { username, password } = req.body;
  // Form validation should be added here
  User.findOne({ username: username }).then((retievedUser) => {
    if (retievedUser) {
      res.redirect('/signup', { message: `Username already taken` });
      return;
    } else {
      const salt = bcrypt.genSaltSync();
      const hash = bcrypt.hashSync(password, salt);
      User.create({ username, password: hash })
        .then((createdUser) => {
          console.log(createdUser);
          res.redirect('/login');
        })
        .catch((err) => next(err));
    }
  });
});

router.get('/login', (req, res, next) => {
  res.render('auth/login');
});

module.exports = router;
