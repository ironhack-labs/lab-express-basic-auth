const express = require("express");
const authRoutes = express.Router();
// User model
const User           = require("../models/user");

// BCrypt to encrypt passwords
const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;

authRoutes.get("/signup", (req, res, next) => {
  res.render("auth/signup");
  authRoutes.post("/signup", (req, res, next) => {
  var username = req.body.username;
  var password = req.body.password;
  var salt     = bcrypt.genSaltSync(bcryptSalt);
  var hashPass = bcrypt.hashSync(password, salt);

  var newUser  = User({
    username,
    password: hashPass
  });

  newUser.save((err) => {
    res.redirect("/");
  });
});
});


module.exports = authRoutes;
