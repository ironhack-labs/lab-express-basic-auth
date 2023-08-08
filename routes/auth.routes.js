const express = require('express');
const router = express.Router();
const User = require('../models/user.model');

router.get('/signup', (req, res) => {
  res.render('auth/signup');
});

router.post('/signup', async (req, res) => {
  const { username, password } = req.body;
  
  try {
    const user = await User.create({ username, password });
    res.json({ data: user }); 
  } catch (error) {
    res.status(500).json({ error: 'Error creating user' });
  }
});

const ensureAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect('/auth/login');
  };

  router.get('/main', ensureAuthenticated, (req, res) => {
    res.render('auth/main');
  });
  
  router.get('/private', ensureAuthenticated, (req, res) => {
    res.render('auth/private');
  });
  
module.exports = router;
