const express = require('express');
const router  = express.Router();
// const login = require('./signup');

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/signup', (req, res, next) => {
  res.render('signup');
});

router.get('/test',(req, res, next) => {
  login.createUser()
});

module.exports = router;
