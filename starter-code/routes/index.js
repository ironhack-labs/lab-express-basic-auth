const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/user');

const requiredSession = (req, res, next) => {
  if (req.session.currentUser) {
    next();
  } else {
    res.redirect('/');
  }
};

const annon = (req, res, next) => {
  if (req.session.currentUser) {
    res.redirect('/main');
  } else {
    next();
  }
};

const router = express.Router();

/* GET home page */
router.get('/', annon, (req, res) => {
  res.render('index');
});

router.post('/login', annon, async (req, res, next) => {
  const { username, pwd } = req.body;

  if (username === '' || pwd === '') {
    console.log('Username or password are empty.');
    return res.redirect('/');
  }

  try {
    const userFound = await User.findOne({ username });
    if (!userFound) {
      console.log(`${username} doesn't exists`);
      return res.redirect('/signup');
    }
    if (bcrypt.compareSync(pwd, userFound.password)) {
      req.session.currentUser = userFound;
      return res.redirect('/main');
    }
    console.log('Username or password incorrect.');
    return res.redirect('/');
  } catch (error) {
    next(error);
  }
});

router.get('/signup', annon, (req, res) => {
  res.render('signup');
});

router.post('/signup', annon, async (req, res, next) => {
  const { username, pwd } = req.body;

  if (username === '' || pwd === '') {
    console.log('Username or password are empty.');
    return res.redirect('/signup');
  }

  try {
    const userFound = await User.findOne({ username });
    if (userFound) {
      console.log(`${username} already exists`);
      return res.redirect('/signup');
    }
    const hashedpwd = bcrypt.hashSync(pwd, 10);
    await User.create({ username, password: hashedpwd });
    return res.redirect('/');
  } catch (error) {
    next(error);
  }
});

router.get('/main', requiredSession, (req, res) => {
  res.render('main');
});

router.get('/private', requiredSession, (req, res) => {
  res.render('private');
});

module.exports = router;
