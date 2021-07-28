const express = require('express');
const router = express.Router();
const User = require('../models/User.model');
const bcryptjs = require('bcryptjs');
const { isValidObjectId } = require('mongoose');
console.log(User);
const SALT = 10;

//signup
router.get('/signup', (req, res, next) => {
  res.render('auth/signup.hbs');
});

router.post('/signup', async (req, res, next) => {
  try {
    const user = req.body;

    if (!user.username || !user.password) {
      res.render('auth/signup.hbs', {
        errorMessage:
          'All fileds are mandatory, please provide your username and password.',
      });
      return;
    }
    const foundUser = await User.findOne({
      username: user.username,
    });
    if (foundUser) {
      res.render('auth/signup.hbs', {
        errorMessage: 'Username taken. Try another one.',
      });
      return;
    }

    const hashedPassword = bcryptjs.hashSync(user.password, SALT);
    user.password = hashedPassword;

    const createdUser = await User.create(user);
    res.redirect('/login');
  } catch (error) {
    next(error);
  }
});

//login
router.get('/login', (req, res, next) => {
  res.render('auth/login.hbs');
});

router.post('/login', async (req, res, next) => {
  try {
    const foundUser = await User.findOne({ username: req.body.username });

    if (foundUser.username === '' || foundUser.password === '') {
      res.render('/login', {
        errorMessage: 'Please enter both username and password to login.',
      });
      return;
    }

    if (!foundUser) {
      res.render('/login', {
        errorMessage: 'Unable to log in. Please try again.',
      });
      return;
    }

    const isValidPassword = bcryptjs.compareSync(
      req.body.password,
      foundUser.password
    );

    if (isValidPassword) {
      req.session.currentUser = {
        _id: foundUser._id,
      };

      res.redirect('/profile');
    } else {
      res.render('auth/login.hbs', {
        errorMessage: 'Bad credentials. Please try again.',
      });
      return;
    }
  } catch (error) {
    next(error);
  }
});

//protected routes

//profile
router.get('/profile', (req, res, next) => {
  res.render('/profile', { userInSession: req.session.currentUser });
});

module.exports = router;
