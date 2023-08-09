const { Router } = require('express');
const router = new Router();

const User = require('../models/User.model');

const bcryptjs = require('bcryptjs');

// Require auth middleware
const { isLoggedIn, isLoggedOut } = require('../middleware/route-guard.js');

// saltRounds gives us the time that the password is going to be hashed
const saltRounds = 10;

// SIGNUP

// GET Route that displays a form for new users to signup
router.get('/signup', isLoggedOut, (req, res, next) => {
  res.render('auth/signup');
});
router.post('/signup', async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      res.render('auth/signup', {
        errorMessage: 'All fields are mandatory to be filled to signup',
      });
      return;
    }
    const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    if (!regex.test(password)) {
      res.status(500).render('auth/signup', {
        errorMessage:
          'Password needs at least 6 characters and must have, at least, 1 uppercase letter',
      });
    }
    // Generate the salt (extra data to password), in 10 saltRounds
    let salt = await bcryptjs.genSalt(saltRounds);
    let hashedPassword = await bcryptjs.hash(password, salt);
    let newUser = await User.create({
      username,
      password: hashedPassword,
    });
    res.redirect('/login');
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      res.status(500).render('auth/signup', { errorMessage: error.message });
    }
    // If MongoDB Error
    else if (error.code === 11000) {
      res.status(500).render('auth/signup', {
        errorMessage: 'User not found and/or incorrect password',
      });
    } else {
      next(error);
    }
  }
});

// POST Route to submit the info of the login Form
router.post('/login', async (req, res, next) => {
  const { username, password } = req.body;
  try {
    if (username === '' || password === '') {
      res.status(400).render('auth/login', {
        errorMessage: 'Please enter both, username and password',
      });
      return;
    }

    // find a User that has the same username that was prompted
    let foundUser = await User.findOne({ username });
    if (!foundUser) {
      res.status(500).render('auth/login', { errorMessage: 'User not found' });
    } else if (bcryptjs.compareSync(password, foundUser.password)) {
      req.session.currentUser = foundUser;
      res.redirect('/profile');
    } else {
      res
        .status(500)
        .render('auth/login', { errorMessage: 'Incorrect password' });
    }
  } catch (error) {}
});

// LOGOUT
router.post('/logout', (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      next(err);
    }
    res.redirect('/');
  });
});

// USER PROFILE
router.get('/profile', isLoggedIn, (req, res) => {
  res.render('user-profile', { userInSession: req.session.currentUser });
});
module.exports = router;
