const { Router } = require('express');
const router = new Router();
const User = require('../models/User.model');
const bcryptjs = require('bcryptjs');
const saltRounds = 10;
const mongoose = require('mongoose');

const { isLoggedIn, isLoggedOut } = require('../middleware/route-guard.js');

// SIGN UP ROUTES
router.get('/signup', isLoggedOut, (req, res) => {
  res.render('auth/signup');
});

router.post('/signup', isLoggedOut, (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.render('auth/signup', { errorMessage: 'All fields are mandatory. Please provide your email and password' });
    return;
  }

  const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!regex.test(password)) {
    res.status(500).render('auth/signup', { errorMessage: 'Password needs to have at least 6 chars and must contain at least one number, one lowercase and one uppercase letter' });
    return;
  }

  bcryptjs
    .genSalt(saltRounds)
    .then((salt) => bcryptjs.hash(password, salt))
    .then((hashedPassword) => {
      return User.create({
        email,
        password: hashedPassword,
      });
    })
    .then(() => {
      res.redirect('/userProfile');
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        res.status(500).render('auth/signup', { errorMessage: err.message });
      } else if (err.code === 11000) {
        res.status(500).render('auth/signup', { errorMessage: 'Email is a already in use, signup with another email' });
      } else {
        next(err);
      }
    });
});

router.get('/userProfile', isLoggedIn, (req, res) => {
  console.log(req.session.currentUser);
  res.render('users/user-profile', { userInSession: req.session.currentUser });
});

// LOGIN ROUTES

router.get('/login', isLoggedOut, (req, res) => {
  res.render('auth/login');
});

router.post('/login', isLoggedOut, (req, res) => {
  const { email, password } = req.body;
  console.log('SESSION =====>', req.session);

  if (email === '' || password === '') {
    res.render('auth/login', {
      errorMessage: 'Please enter both, email and password to login.',
    });
    return;
  }

  User.findOne({ email })
    .then((user) => {
      if (!user) {
        res.render('auth/login', { errorMessage: 'Email is not registered. Try with other email' });
        return;
      } else if (bcryptjs.compareSync(password, user.password)) {
        // res.render('users/user-profile', { user });
        const { email, _id } = user;
        req.session.currentUser = { email, _id };
        res.redirect('/userProfile');
      } else {
        res.render('auth/login', { errorMessage: 'Incorrect password' });
      }
    })
    .catch((err) => {
      console.log(err);
    });
});

// LOGOUT ROUTE

router.post('/logout', isLoggedIn, (req, res, next) => {
  req.session.destroy((err) => {
    if (err) next(err);
    res.redirect('/');
  });
});

module.exports = router;
