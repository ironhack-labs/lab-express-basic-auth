const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const bcryptSalt = 10;

const User = require('../models/user');

router.get('/signup', (req, res, next) => {
  res.render('auth/signup');
});

router.post('/signup', (req, res, next) => {
  const { username, password } = req.body;

  if (username === '' || password === '') {
    const error = 'Usuario y password no pueden estar vacios';
    res.render('auth/signup', { error });
  } else {
    User.findOne({ username })
      .then((user) => {
        if (!user) {
          const salt = bcrypt.genSaltSync(bcryptSalt);
          const hashPass = bcrypt.hashSync(password, salt);

          const newUser = {
            username,
            password: hashPass,
          };

          User.create(newUser)
            .then((doc) => {
              res.redirect('/');
            })
            .catch((err) => {
              const error = 'Problema al crear el usuario';
              res.render('auth/signup', { error });
            });
        } else {
          const error = 'Usuario ya existente';
          res.render('auth/signup', { error });
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

  if (username === '' || password === '') {
    const error = 'Usuario y password no pueden estar vacios';
    res.render('auth/login', { error });
  } else {
    User.findOne({ username })
      .then((user) => {
        if (!user) {
          const error = 'usuario y password incorrectos';
          res.render('auth/login', { error });
        } else if (bcrypt.compareSync(password, user.password)) {
          req.session.currentUser = user._id;
          res.redirect('/private');
        } else {
          const error = 'usuario y password incorrectos';
          res.render('auth/login', { error });
        }
      });
  }
});

router.get('/logout', (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      next(err);
    } else {
      res.redirect('/login');
    }
  });
});

module.exports = router;
