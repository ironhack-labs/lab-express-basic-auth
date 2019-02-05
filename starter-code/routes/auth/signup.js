const express = require('express');

const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../../models/User');

const saltRounds = 10;

router.get('/', (req, res) => {
  res.render('auth/signup');
});

router.post('/', (req, res) => {
  const { username, password } = req.body;
  const salt = bcrypt.genSaltSync(saltRounds);
  const hash = bcrypt.hashSync(password, salt);
  const newUser = User({
    username,
    password: hash
  });

  if (username === '' || password === '') {
    console.log('a');
    res.render('auth/signup', { errorMessage: 'Username and password cannot be null' });
  }

  User.findOne({ username })
    .then((result) => {
      if (result === null) {
        newUser.save()
          .then(() => {
            res.render('home');
          });
      } else {
        res.render('auth/signup', { errorMessage: 'Username already in use!' });
      }
    });
});

module.exports = router;
