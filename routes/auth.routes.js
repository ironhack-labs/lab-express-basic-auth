const { Router } = require('express');
const router = new Router();
const bcryptjs = require('bcryptjs');
const saltRounds = 10;
const User = require('../models/User.model');
const mongoose = require('mongoose');


// SIGNUP

router.get('/signup', (req, res) => res.render('auth/signup'));

router.post('/signup', (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.render('auth/signup', { errorMessage: 'All fields are mandatory. Please provide your username and password.' });
    return
  }

  const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!regex.test(password)) {
    res
      .status(500)
      .render('auth/signup', { errorMessage: 'Password needs to have at least 6 chars and must contain at least one number, one lowercase and one uppercase letter.' });
    return;
  }

  bcryptjs
    .genSalt(saltRounds)
    .then(salt => bcryptjs.hash(password, salt))
    .then(hashedPassword => {
      return User.create({
        username,
        password: hashedPassword
      });
    })
    .then(userFromDB => {
      console.log('Newly created user is: ', userFromDB);
      req.session.isSignup = true;
      res.redirect('/');
    })
    .catch(error => {
      if (error instanceof mongoose.Error.ValidationError) {
        res.status(500).render('auth/signup', { errorMessage: error.message });
      } else if (error.code === 11000) {
        res.status(500).render('auth/signup', {
          errorMessage: 'Username and password need to be unique. Either username or password is already used.'
        });
      } else {
        next(error);
      }
    });
});


  // LOGIN
router.get('/login', (req, res) => res.render('auth/login'));

// .post() login route ==> to process form data
router.post('/login', (req, res, next) => {
  // console.log('SESSION =====> ', req.session);
  const { username, password } = req.body;

  if (!username || !password) {
    res.render('auth/login', {
      errorMessage: 'Please enter both username and password to login.'
    });
    return;
  }

  User.findOne({ username })
    .then(user => {
      if (!user) {
        res.render('auth/login', { errorMessage: 'User is not registered. Try agin.' });
        return;
      } else if (bcryptjs.compareSync(password, user.password)) {
        req.session.currentUser = user;
        res.redirect('/');
      } else {
        res.render('auth/login', { errorMessage: 'Incorrect password.' });
      }
    })
    .catch(error => next(error));
});


// LOGOUT
router.post('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

module.exports = router;