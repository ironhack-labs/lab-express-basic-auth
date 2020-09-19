const express = require('express');
const User = require('../models/User.model');
const passwordManager = require('../utils/passwordManager');

const router = express.Router();

router.get('/signup', (req, res) => res.render('auth-views/signup'));

router.post('/signup', async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const existingUser = await User.findOne({ username });

    if (existingUser) {
      res.render('auth-views/signup', { errorMessage: 'The user already exists. Please choose another.' });

      return;
    }

    const newUser = new User({
      username,
      password: await passwordManager.encryptPassword(password),
    });

    await newUser.save();

    res.redirect('/login');
  } catch (error) {
    return next(error);
  }
});

router.get('/login', (req, res) => res.render('auth-views/login'));

router.post('/login', async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const existingUser = await User.findOne({ username });

    if (!existingUser || !passwordManager.verifyPassword(password, existingUser.password)) {
      res.render('auth-views/login', { errorMessage: 'Username or password are incorrect' });

      return;
    }

    req.session.currentUser = existingUser;

    res.redirect('/main');
  } catch (error) {
    return next(error);
  }
});

router.get('/logout', (req, res) => {
  req.session.destroy();

  res.redirect('/login');
});

module.exports = router;
