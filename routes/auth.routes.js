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

router.get('auth/signup', isLoggedOut, (req, res, next) => {
    res.render('signup');
  });
  
  router.post('auth/signup', (req, res, next) => {
    const { username, password } = req.body;
  
    if (!username || !password) {
      res.render('signup', {
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
        res.redirect('/profile');
      })
      .catch((err) => {
        if (err instanceof mongoose.Error.ValidationError) {
          res.status(500).render('signup', { errorMessage: err.message });
        } else {
          next(err);
        }
      });
  });


// Profile

router.get('auth/profile', isLoggedIn, (req, res, next) => {
  res.render('profile', { user: req.session.currentUser });
});


// Login

router.get('auth/login', (req, res, next) => {
    res.render('login');
  });

  router.post('auth/login', (req, res, next) => {
    const { username, password } = req.body;
  
    if (!username || !password) {
      res.render('login', { errorMessage: 'Please provide both username and password' });
      return;
    }
    User.findOne({ username }).then((user) => {
        if (!user) {
          res.render('login', { errorMessage: 'Username not found.' });
          return;
        } else if (bcrypt.compareSync(password, user.password)) {
          req.session.currentUser = user;
          res.render('profile', { user });
        } else {
          res.render('login', { errorMessage: 'Incorrect password' });
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


