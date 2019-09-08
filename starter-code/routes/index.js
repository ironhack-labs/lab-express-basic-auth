const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/signup', (req, res, next) => {
  res.render('signup', { registered: false });
});

router.post('/signup', async (req, res, next) => {
  const salt = await bcrypt.genSalt(5);
  const password = await bcrypt.hash(req.body.password, salt);
  const user = await User.create({
    username: req.body.username,
    password
  });
  res.render('signup', { registered: true, username: user.username });
});

router.get('/login', (req, res, next) => {
  res.render('login');
});

router.post('/login', async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    res.render('login', { err: 'User not found' });
  } else {
    if (await bcrypt.compare(password, user.password)) {
      req.session.loggedUser = user;
      res.redirect('/main');
    } else {
      res.render('login', { err: 'Invalid Password' });
    }
  }
});

router.get('/main', isLoggedIn, (req, res, next) => {
  res.render('main');
});

router.get('/private', isLoggedIn, (req, res, next) => {
  res.render('private');
});

function isLoggedIn(req, res, next) {
  if (req.session.loggedUser) {
    next();
  } else {
    res.redirect('/login');
  }
}

module.exports = router;
