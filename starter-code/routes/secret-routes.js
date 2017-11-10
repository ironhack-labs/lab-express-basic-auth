const express = require('express');
const isLoggedIn = require('../middlewares/isLoggedIn');
const router = express.Router();

router.get('/secret',isLoggedIn, (req,res) => {
  res.render('secret');
});

router.get('/secret-main',isLoggedIn, (req,res) => {
  res.render('secret-main');
});


module.exports = router;
