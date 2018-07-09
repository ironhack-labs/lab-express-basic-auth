'use strict';

var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('auth/login');
});

router.post('/', (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || password) {
    res.redirect('/login'); // This is redirecting to signup I have no idea why.
  }
}); ;

module.exports = router;
