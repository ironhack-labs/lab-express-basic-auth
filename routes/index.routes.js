const express = require('express');
const router = express.Router();

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index', { signupMessage: 'You are signed up now' });
});

module.exports = router;
