const router = require('express').Router();
const bcryptjs = require('bcryptjs');
const saltRounds = 12;

const User = require('../models/User.model');

/* GET SignIn page */
router.get('/signup', (req, res, next) => {
  res.render('signup/signup');
});

/* POST SignIn data */
router.post('/signup', (req, res, next) => {
  const { username, password } = req.body;
  bcryptjs
    .genSalt(saltRounds)
    .then((salt) => bcryptjs.hash(password, salt))
    .then((hashedPassword) => {
      User.create({
        username,
        password: hashedPassword,
      });
      res.redirect('/profile');
    })

    .catch((error) => next(error));
});

/* GET LogIn page */
router.get('/login', (req, res, next) => {
  res.render('signup/login');
});

/* POST LogIn data */
router.post('/login', (req, res, next) => {
  console.log(req.body);
});

/* GET Profile-Page */
router.get('/profile', (req, res, next) => {
  res.render('user/profile-page');
});

module.exports = router;
