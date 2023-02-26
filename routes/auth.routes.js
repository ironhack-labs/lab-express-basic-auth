const { Router } = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const router = new Router();
const User = require('../models/User.model');

const saltRounds = 10;

//GET signup route
router.get('/signup', (req, res) => res.render('auth/signup'));

//GET user profile route
router.get('/userProfile', (req, res) => {
  res.render('auth/user-profile', { userInSession: req.session.currentUser });
});
//GET login route
router.get('/login', (req, res) => res.render('auth/login'));

//POST signup/register route
router.post('/signup', async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    //server-side validation
    if (!username || !email || !password) {
      res.render('auth/signup', {
        errorMessage:
          'All fields are mandatory. Please provide your username and password.',
      });
      return;
    }

    // make sure passwords are strong:
    const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    if (!regex.test(password)) {
      res.status(500).render('auth/signup', {
        errorMessage:
          'Password needs to have at least 6 chars and must contain at least one number, one lowercase and one uppercase letter.',
      });
      return;
    }

    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    await User.create({
      username,
      email,
      password: hashedPassword,
    });

    res.redirect('/userProfile');
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      res.status(500).render('auth/signup', { errorMessage: error.message });
    } else if (error.code === 11000) {
      res.status(500).render('auth/signup', {
        errorMessage:
          'Username and email need to be unique. Either username or email is already used.',
      });
    } else {
      next(error);
    }
  }
});

//POST login route
router.post('/login', (req, res, next) => {
  console.log('SESSION =====> ', req.session);

  const { email, password } = req.body;

  if (email === '' || password === '') {
    res.render('auth/login', {
      errorMessage: 'Please enter both, email and password to login.',
    });
    return;
  }

  User.findOne({ email })
    .then((user) => {
      if (!user) {
        res.render('auth/login', {
          errorMessage: 'Email is not registered. Try with other email.',
        });
        return;
      } else if (bcrypt.compareSync(password, user.password)) {
        //******* SAVE THE USER IN THE SESSION ********//
        req.session.currentUser = user;
        res.redirect('/userProfile');
      } else {
        res.render('auth/login', { errorMessage: 'Incorrect password.' });
      }
    })
    .catch((error) => next(error));
});

//POST logout route
router.post('/logout', (req, res, next) => {
  req.session.destroy((err) => {
    if (err) next(err);
    res.redirect('/');
  });
});

module.exports = router;
