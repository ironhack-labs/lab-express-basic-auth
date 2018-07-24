const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const saltRounds = 10;

const User = require('../models/user');

router.get('/signup', (req, res, next) => {
  res.render('auth/signup');
});

router.post('/signup', (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.render('auth/signup', { message: 'Introducir usuario y password' });
  }
  User.findOne({ username })
    .then((user) => {
      if (user) {
        return res.render('auth/signup', { message: 'Usuario ya existente' });
      } else {
        const salt = bcrypt.genSaltSync(saltRounds);
        const hashedPassword = bcrypt.hashSync(password, salt);
        const newUser = new User({ username, password: hashedPassword });
        newUser.save()
          .then(user => {
            req.session.currentUser = user;
            res.redirect('/');
          });
      }
    })
    .catch(error => {
      next(error);
    });
});

router.get('/login', (req, res, next) => {
  res.render('auth/login');
});

router.post('/login', (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.render('auth/login', { message: 'Introducir usuario y password' });
  }
  User.findOne({ username })
    .then(user => {
      if (!user) {
        return res.render('auth/login', { message: 'usuario o password incorrecto' });
      }
      if (bcrypt.compareSync(password /* provided password */, user.password/* hashed password */)) {
        // Save the login in the session!
        req.session.currentUser = user;
        res.redirect('/');
      } else {
        return res.render('auth/login', { message: 'usuario o password incorrecto' });
      }
    })
    .catch(next);
});

module.exports = router;
