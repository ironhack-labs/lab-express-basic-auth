const express = require("express");
const authRoutes = express.Router();
const User = require("../model/User");
const bcrypt     = require("bcrypt");
const saltRounds = 10;

authRoutes.get("/", (req, res, next) => {
  res.render("auth/signup");
});
authRoutes.post("/signup", (req, res, next) => {
  var username = req.body.username;
  var password = req.body.password;

  // var salt = bcrypt.genSatlSync(bcryptSalt);
  // var hashPass = bcrypt.hashSync(password, salt);

  var newUser = User ({
    username,
    password: hashPass
  });

  newUser.save((err) => {
    res.redirect("/signup");
  });
});
