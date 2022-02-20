//---- Imports -----//

const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const saltRounds = 10;

const User = require('../models/User.model');

const router = require('express').Router();

// Middleware

const { isLoggedIn, isLoggedOut } = require('../middleware/route-guard');

// ----- Routes ------ //

// Sign Up

router.get('/signup', isLoggedOut, (req, res, next) => {
    res.render('auth/signup');
  });
  
  router.post('/signup', (req, res, next) => {
    const { username, password } = req.body;
  
    if (!username || !password) {
      res.render('auth/signup', {
        errorMessage: 'Please provide both username and password',
      });
      return;
    }
  
    bcrypt
      .genSalt(saltRounds)
      .then((salt) => bcrypt.hash(password, salt))
      .then((hashedPassword) => {
        return User.create({ username, password: hashedPassword });
      })
      .then(() => {
        res.redirect('/auth/profile');
      })
      .catch((err) => {
        if (err instanceof mongoose.Error.ValidationError) {
          res.status(500).render('auth/signup', { errorMessage: err.message });
        } else {
          next(err);
        }
      });
  });


// Profile

router.get('/profile', isLoggedIn, (req, res, next) => {
  res.render('auth/profile', { user: req.session.currentUser });
});


// Login

router.get('/login', (req, res, next) => {
    res.render('auth/login');
  });

  router.post('/login', (req, res, next) => {
    const { username, password } = req.body;
  
    if (!username || !password) {
      res.render('auth/login', { errorMessage: 'Please provide both username and password' });
      return;
    }
    User.findOne({ username }).then((user) => {
        if (!user) {
          res.render('auth/login', { errorMessage: 'Username not found.' });
          return;
        } else if (bcrypt.compareSync(password, user.password)) {
          req.session.currentUser = user;
          res.render('auth/profile', { user });
        } else {
          res.render('auth/login', { errorMessage: 'Incorrect password' });
        }
      });
    });

    router.post('/logout', (req, res, next) => {
        req.session.destroy((err) => {
          if (err) next(err);
          res.redirect('/');
        });
      });
      

// ---- Exports ---- //

module.exports = router;


