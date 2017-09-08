const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const User = require('../models/User');
const bcryptSalt = 10;

router.get('/signup', (req, res) =>{
  res.render('auth/signup', {
    title: 'Signup'
  });
});

router.post('/signup', (req, res) =>{
  const username = req.body.username;
  const password = req.body.password;

  if (username === "" || password  === "") {
    res.render('auth/signup',{
      errorMessage: "Indicate a username and a password to sign up"
    });
  }

});

module.exports = router;
