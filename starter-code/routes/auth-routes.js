const express = require("express");
const authRoutes = express.Router();
const User = require("../models/user");


// BCrypt to encrypt passwords
const bcrypt = require("bcryptjs");
const bcryptSalt = 10;

authRoutes.get('/signup', (req, res, next) => {
  res.render('auth/signup');
})

authRoutes.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const salt = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(password, salt);
  console.log(`Usuario ${username}`);
  const newUser  = User({
    username,
    password: hashPass
  });

  newUser.save((err) => {
    res.redirect("/");
  });
});

module.exports = authRoutes;
