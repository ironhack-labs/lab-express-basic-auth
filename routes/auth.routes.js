const { Router } = require('express');
const router = new Router();
const mongoose = require('mongoose');
const User = require('../models/User.model');
const { isLoggedIn, isLoggedOut } = require('../middleware/route-guard.js');
const bcryptjs = require('bcryptjs');
const saltRounds = 10;

// GET route to display the signup form to users:
router.get('/signup', isLoggedOut, (req, res) => res.render('auth/signup'));

// POST route to process form data:
router.post('/signup', (req, res, next) => {
    const { username, password } = req.body;
   
    bcryptjs
      .genSalt(saltRounds)
      .then(salt => bcryptjs.hash(password, salt))
      .then(hashedPassword => {
        return User.create({
          username,
          passwordHash: hashedPassword
        });
      })
      .then(userFromDB => {
        res.redirect('/userProfile');
      })
      .catch(error => next(error));
});

// GET route ==> to display the login form to users
router.get('/login', (req, res) => res.render('auth/login'));

// POST login route ==> to process form data
router.post('/login', (req, res, next) => {

  console.log('SESSION =====> ', req.session);

  const { username, password } = req.body;
 
  if (username === '' || password === '') {
    res.render('auth/login', {
      errorMessage: 'Please enter your username and password to login.'
    });
    return;
  }
 
  User.findOne({ username })
    .then(user => {
      if (!user) {
        res.render('auth/login', { errorMessage: 'Username is not registered.' });
        return;
      } else if (bcryptjs.compareSync(password, user.passwordHash)) {
        req.session.currentUser = user;
        res.redirect('/userProfile');
      } else {
        res.render('auth/login', { errorMessage: 'Incorrect password.' });
      }
    })
    .catch(error => next(error));
});

// POST logout:
router.post('/logout', (req, res, next) => {
  req.session.destroy(err => {
    if (err) next(err);
    res.redirect('/');
  });
});

// GET route to user proile page:
router.get('/userProfile', isLoggedIn, (req, res) => {
  res.render('users/user-profile', { userInSession: req.session.currentUser });
});

module.exports = router;