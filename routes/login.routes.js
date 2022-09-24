const router = require('express').Router();
const bcryptjs = require('bcryptjs');
const { isLoggedIn, isLoggedOut } = require('../middleware/route-guard.js');

const User = require('../models/User.model');

const errorMessage = { errorHeader: 'Ups, something went wrong,', errorMessage: 'please try again.' };

// Iteration 2
/* GET LogIn page */
router.get('/login', isLoggedOut, (req, res, next) => {
  res.render('auth/login');
});

/* POST LogIn data */
router.post('/login', isLoggedOut, async (req, res, next) => {
  const { username: usernameDirty, password } = req.body;
  const username = req.sanitize(usernameDirty);

  // Check if Username and password are provided
  if (!username || !password) {
    res.render('auth/login', errorMessage);
    return;
  }
  try {
    const user = await User.findOne({ username });
    if (!user) {
      res.render('auth/login', errorMessage);
      return;
    } else if (bcryptjs.compare(password, user.passwordHash)) {
      //Save user in session
      req.session.currentUser = user;
      res.redirect('/userprofile');
    } else {
      res.render('auth/login', errorMessage);
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

module.exports = router;
