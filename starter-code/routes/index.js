const express = require('express');
const router  = express.Router();

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('home');
});

router.get('/signup', (req, res, next) => {
  res.render('/auth/signup');
});

router.get('/auth/main', (req, res, next) => {
  res.render('/auth/main');
});

router.get('/user/private', (req, res, next) => {
  res.render('/user/private');
});


module.exports = router;
