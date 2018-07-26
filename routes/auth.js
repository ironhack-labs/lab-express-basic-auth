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

module.exports = router;
