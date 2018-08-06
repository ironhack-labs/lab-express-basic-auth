const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const saltRounds = 10;

const User = require('../models/user');

//SIGN UP
router.get('/signup', (req, res, next) => {
  const data = { message: req.flash('info') };
  res.render('auth/signup', data)
})

router.post('/signup', (req, res, next) => {
  const { username, password } = req.body;
  const salt = bcrypt.genSaltSync(saltRounds);
  const hashedPassword = bcrypt.hashSync(password, salt);

  if (!username || !password) {
    req.flash('info', 'The fields can\'t be empty!');
    res.redirect('/auth/signup');
  } else {
    User.findOne({ username })
      .then((user) => {
        if(user) {
          req.flash('info', 'The username can\'t be repeated :(');
          res.redirect('/auth/signup');
        } else {
          User.create({
            username,
            password: hashedPassword,
          })
          .then((newUser) => {
            req.flash('info', 'You create a new user :)');
            res.redirect('/');
          })
          .catch((error) => {
            next(error);
          })
        }
      })
  }
});

//LOGIN
router.get('/login', (req, res, next) => {
  const data = { message: req.flash('info') };
  res.render('auth/login', data);
});

router.post('/login', (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) {
    req.flash('info', 'The fields can\'t be empty!');
    res.redirect('/auth/login')
  } else {
    User.findOne({ username })
      .then(user => {
        if (user) {
          if (bcrypt.compareSync(password, user.password)) {
            req.session.currentUser = user;
            res.redirect('../main');
          } else {
            req.flash('info', 'Your username or password is incorrect :(');
            res.redirect('/auth/login')
          }
        } else {
          req.flash('info', 'Your username or password is incorrect :(');
          res.redirect('/auth/login')
        }
      })
      .catch(error => {
        next(error);
      })
  }
})

router.post('/logout', (req, res, next) => {
  delete req.session.currentUser;
  res.redirect('login');
});

module.exports = router;