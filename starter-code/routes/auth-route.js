
const express = require('express');
const bcrypt = require('bcrypt');
const bcryptSalt = 10;
const authRoutes = express.Router();

const User = require('../models/users');

authRoutes.get('/signup', (req, res, next) => {
  res.render('auth/signup');
});

authRoutes.post('/signup', (req, res, next) => {
  const { username, password } = req.body;

  if (username === '' || password === '') {
    const errorMessage = 'Username nor password cannot be empty';
    res.render('auth/signup', { errorMessage });
  } else {
    User.findOne({ username })
      .then((user) => {
        if (!user) {
          const salt = bcrypt.genSaltSync(bcryptSalt);
          const hashPass = bcrypt.hashSync(password, salt);

          const newUser = {
            username,
            password: hashPass
          };

          User.create(newUser)
            .then((doc) => {
              res.redirect('/index');
            })
            .catch((err) => {
              if (err) {
                const errorMessage = 'There was a problem creating the user';
                res.render('auth/signup', { errorMessage });
              }
            });
        } else {
          const error = 'The Username already exist';
          res.render('auth/signup', { error });
        }
      })
      .catch((err) => {
        next(err);
      });
  }
});

authRoutes.get('/login', (req, res, next) => {
  res.render('auth/login');
});

authRoutes.post('/login', (req, res, next) => {
  const { username, password } = req.body;

  if (username === '' || password === '') {
    const errorMessage = 'The username nor the password cannot be empty';
    res.render('auth/login', { errorMessage });
  } else {
    User.findOne({ username })
      .then((user) => {
        if (!user) {
          const errorMessage = 'The username and password are incorrect';
          res.render('auth/login', { errorMessage });
        } else if (bcrypt.compareSync(password, user.password)) {
          req.session.currentUser = user._id;
          res.redirect('/index');
        } else {
          const errorMessage = 'Username or password is incorrect';
          res.render('auth/login', { errorMessage });
        }
      });
  }
});

module.exports = authRoutes;
