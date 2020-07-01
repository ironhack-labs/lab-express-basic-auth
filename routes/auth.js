const express = require("express");
const router = express.Router();
const User = require('../models/User.model');
const bcrypt = require('bcrypt');

router.get('/signup', (req, res) => {
    res.render('signup');
  });

router.post('/signup', (req, res, next) => {
    const { username, password } = req.body;
    //
    if (password.length < 8) {
      res.render('signup', { message: 'Your password has to be 8 characters  minimum' });
      return;
    }
    if (username === '') {
      res.render('signup', { message: 'Your username cannot be empty' });
      return;
    }})

    module.exports = router;