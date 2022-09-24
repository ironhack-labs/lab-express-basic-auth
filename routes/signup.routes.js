const router = require('express').Router();
const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');
const saltRounds = 12;

const { isLoggedOut } = require('../middleware/route-guard.js');

const User = require('../models/User.model');

// Iteration 1
/* GET SignIn page */
router.get('/signup', isLoggedOut, (req, res, next) => {
  res.render('auth/signup');
});

/* POST SignIn data */
router.post('/signup', isLoggedOut, async (req, res, next) => {
  const { username: usernameDirty, password } = req.body;
  const username = req.sanitize(usernameDirty);

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
    console.log('New user:', username);
  } catch (error) {
    // Check if Username is valid, see User.model, mongooseError
    if (error instanceof mongoose.Error.ValidationError) {
      res.status(500).render('auth/signup', { errorMessage: error.message });
      // Check if username is already taken, mongoError
    } else if (error.code === 11000) {
      // Get username from error
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

module.exports = router;
