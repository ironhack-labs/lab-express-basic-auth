const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User.model');
const router = express.Router();

// GET sign-up form
router.get('/signup', (req, res) => {
  res.render('auth/signup');
});

// POST sign-up form
router.post('/signup', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.render('auth/signup', { error: 'All fields are required.' });
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await User.create({ username, password: hashedPassword });
    res.redirect('/login');
  } catch (error) {
    res.render('auth/signup', { error: 'Error during sign-up.' });
  }
});

// GET login form
router.get('/login', (req, res) => {
  res.render('auth/login');
});

// POST login form
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.render('auth/login', { error: 'All fields are required.' });
  }

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.render('auth/login', { error: 'Invalid username or password.' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.render('auth/login', { error: 'Invalid username or password.' });
    }

    // Save the user in the session
    req.session.user = user;
    res.redirect('/main');
  } catch (error) {
    res.render('auth/login', { error: 'Error during login.' });
  }
});

module.exports = router;

