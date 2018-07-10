const express = require('express');
const authRoutes = express.Router();

authRoutes.get('/signup', (req, res, next) => {
  res.render('auth/signup');
});

// User model
const User           = require("../models/user");

// BCrypt to encrypt passwords
const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;

authRoutes.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const salt     = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(password, salt);

  if (!username || password) {
    res.redirect('auth/signup');
  }

  user.find({username: req.body.username})
  .then((user) => {
    res.redirect('auth/signup'); })
  .catch(next(err))


  const newUser  = User({
    username,
    password: hashPass,
  });

  newUser.save()
  .then(user => {
    res.redirect("/");
  })
});

module.exports = authRoutes;
