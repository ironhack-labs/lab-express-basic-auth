const express = require('express');

const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../../models/User');

router.get('/', (req, res) => {
  res.render('auth/signin');
});

router.post('/', (req, res) => {
  const { username, password } = req.body;
  if (username === '' || password === '') {
    res.render('auth/signin', { errorMessage: 'Username and password cannot be null' });
  }
  User.findOne({ username })
    .then((result) => {
      if (result && bcrypt.compareSync(password, result.password)) {
        req.session.currentUser = result;
        res.redirect('/home');
      } else {
        res.render('auth/signin', { errorMessage: 'Invalid username or password!' });
      }
    });
});

module.exports = router;
