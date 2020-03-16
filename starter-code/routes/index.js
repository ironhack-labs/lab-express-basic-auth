const express = require('express');
const router  = express.Router();

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('home');
});

router.get('/login', (req, res, next) => {
  res.render('auth/login');
});

router.get('/signup', (req, res, next) => {
  res.render('auth/signup');
});

router.get('/public-image', (req, res, next) => {
  res.render('main');
});

router.get('/private', (req, res, next) => {
  res.render('private');
});

module.exports = router;
