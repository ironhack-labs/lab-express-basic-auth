// This is our auth.js
const express = require('express');
const router  = express.Router();

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('auth/signup');
});

module.exports = router;
