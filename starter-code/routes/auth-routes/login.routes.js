const express = require('express');
const router = express.Router();
const User = require('../../models/User.model');
const bcrypt = require('bcrypt');
const salt = 10;

//Login
router.get('/login', (req, res) => {
  res.render('auth/login');
});
//Register
router.get('/register', (req, res) => {
  res.render('auth/register');
});

module.exports = router;
