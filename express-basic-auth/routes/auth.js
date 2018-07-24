const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const saltRounds = 10;

const User = require('../models/user');

router.get('/signup', (req, res, next) => {
  const data = {
    messages: req.flash('message-name')
  };
  res.render('auth/signup', data);
});

router.post('/signup', (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) {
    req.flash('message-name', 'Introducir usuario y password');
    return res.redirect('/auth/signup');
  }
  User.findOne({ username })
    .then((user) => {
      if (user) {
        req.flash('message-name', 'Usuario ya existente');
        return res.redirect('/auth/signup');
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
  const data = {
    messages: req.flash('message-name')
  };
  res.render('auth/login', data);
});

router.post('/login', (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) {
    req.flash('message-name', 'Introducir usuario y password');
    return res.redirect('/auth/login');
  }
  User.findOne({ username })
    .then(user => {
      if (!user) {
        req.flash('message-name', 'usuario o password incorrecto');
        return res.redirect('/auth/login');
      }
      if (bcrypt.compareSync(password /* provided password */, user.password/* hashed password */)) {
        // Save the login in the session!
        req.session.currentUser = user;
        res.redirect('/');
      } else {
        req.flash('message-name', 'usuario o password incorrecto');
        return res.redirect('/auth/login');
      }
    })
    .catch(next);
});

router.post('/logout', (req, res, nect) => {
  delete req.session.currentUser;
  res.redirect('/auth/login');
});

module.exports = router;
