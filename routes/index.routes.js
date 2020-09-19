const express = require('express');

const router = express.Router();

const User = require('../models/User.model');
const { generateEncryptedPassword } = require('../utils/passwordManager');

const verifyData = require('../middlewares/verifyData');
const verifyLoginData = require('../middlewares/verifyLoginData');
const redirectIfLoggedIn = require('../middlewares/redirectIfLoggedIn');

/* GET home page */
router.get('/', redirectIfLoggedIn, (req, res, next) => {
  res.render('index');
});

router.get('/signup', (req, res) => {
  console.log('Sign-up page')
  res.render('signup.hbs');
});

router.post('/signup', verifyData, async (req, res) => {
  try {
    const { username, password } = req.body;

    const newUser = new User({
      username,
      password: await generateEncryptedPassword(password),
    });

    await newUser.save();

    res.redirect('/login');
  } catch (error) {
    console.log(error);
  }
});

router.get('/login', (req, res) => {
  console.log('Login page');

  res.render('login', req.query);
});

router.post('/login', verifyLoginData, async (req, res) => {
  try {
    const userAuthCopy = JSON.parse(JSON.stringify(req.userAuthenticated));

    delete userAuthCopy.password;

    req.session.currentUser = userAuthCopy;

    res.redirect('/main');
  } catch (error) {
    console.log(error);
  }
});

router.get('/logout', (req, res) => {
  req.session.destroy();

  res.redirect('/login');
});

module.exports = router;
