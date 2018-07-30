const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const saltRounds = 10;

const User = require('../models/user');

// Iteration 1: Create a sign up form.

router.get("/signup", (req, res, next) => {
  res.render("signup");
});

router.post('/signup', (req, res, next) => {
  const { name, username, password } = req.body;
  const newUser = new User({ name, username, password })
  newUser.save()
  .then((user) => {
    res.redirect('success')
  })
  .catch((error) => {
    console.log(error)
  })
});

router.get("/success", (req, res, next) => {
  res.render("success");
});

module.exports = router;