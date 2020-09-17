const express = require('express');
const router = express.Router();

const User = require('../models/User.model');
const generateEncryptedPassword = require('../utils/passwordManager');
const verifyData = require('../utils/verifyData');

/* GET home page */
router.get('/', (req, res, next) => res.render('index'));

router.get('/signup', (req, res) => {
  console.log('Sign-up page')
  res.render('signup.hbs');
});

router.post('/signup', async (req, res) => {
  try {
    const { username, password } = req.body;

    const isDataValid = await verifyData(req, res);

    if (!isDataValid) {
      return;
    }

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

module.exports = router;
