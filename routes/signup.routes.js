const router = require('express').Router();
const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');
const saltRounds = 12;

const { isLoggedIn, isLoggedOut } = require('../middleware/route-guard.js');

const User = require('../models/User.model');

// Iteration 1
/* GET SignIn page */
router.get('/signup', isLoggedOut, (req, res, next) => {
  res.render('auth/signup');
});

/* POST SignIn data */
router.post('/signup', isLoggedOut, async (req, res, next) => {
  const { username, password } = req.body;

  // Check if Username and password are provided
  if (!username || !password) {
    res.render('auth/signup', { errorHeader: 'All fields are mandatory.', errorMessage: 'Please provide a username and a password.' });
    return;
  }

  // Check if password is "strong"
  const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!regex.test(password)) {
    res.status(500).render('auth/signup', {
      errorHeader: 'Password needs to have at least 6 characters.',
      errorMessage: 'It must contain at least one number, one lowercase and one uppercase letter.',
    });
    return;
  }

  try {
    const salt = await bcryptjs.genSalt(saltRounds);
    const hashedPassword = await bcryptjs.hash(password, salt);
    await User.create({ username, passwordHash: hashedPassword });
    res.redirect('/login');
  } catch (error) {
    // Check if Username is valid, see User.model, mongooseError
    if (error instanceof mongoose.Error.ValidationError) {
      res.status(500).render('auth/signup', { errorMessage: error.message });
      // Check if Username and email is already taken, mongoError
    } else if (error.code === 11000) {
      // Get username
      const {
        keyValue: { username },
      } = error;
      res.status(500).render('auth/signup', {
        errorHeader: `Username "${username}" is already taken.`,
        errorMessage: 'Please try again.',
      });
    } else {
      next(error);
    }
  }
});

// Iteration 2
/* GET LogIn page */
router.get('/login', isLoggedOut, (req, res, next) => {
  res.render('auth/login');
});

/* POST LogIn data */
router.post('/login', isLoggedOut, async (req, res, next) => {
  console.log('SESSION =====> ', req.session);

  const { username, password } = req.body;

  // Check if Username and password are provided
  if (!username || !password) {
    res.render('auth/login', { errorHeader: 'Ups, here is something missing,', errorMessage: 'please provide both username and password.' });
    return;
  }
  try {
    const user = await User.findOne({ username });
    if (!user) {
      res.render('auth/login', { errorHeader: `Hm, are you sure about "${username}"?`, errorMessage: 'There is no user with that username.' });
      return;
    } else if (bcryptjs.compare(password, user.passwordHash)) {
      //Save user in session
      req.session.currentUser = user;
      res.redirect('/userprofile');
    } else {
      res.render('auth/login', { errorMessage: 'Incorrect password.' });
    }
  } catch (error) {
    next(error);
  }
});
/* POST Logout */
router.post('/logout', isLoggedIn, (req, res, next) => {
  req.session.destroy((err) => {
    if (err) next(err);
    res.redirect('/');
  });
});

/* GET Profile-Page */
router.get('/userprofile', isLoggedIn, (req, res, next) => {
  res.render('user/profile-page', { userInSession: req.session.currentUser });
});

// Iteration 3
router.get('/content/main', isLoggedIn, (req, res, next) => {
  res.render('content/main', { userInSession: req.session.currentUser });
});

router.get('/content/private', isLoggedIn, (req, res, next) => {
  res.render('content/private', { userInSession: req.session.currentUser });
});

module.exports = router;
