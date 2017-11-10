// const authRoutes = require('./routes/auth');
const express = require("express");
const router = express.Router();
const path = require('path');
const debug = require('debug')('basic-auth:'+path.basename(__filename));
// User model
const User           = require("../models/user");
// BCrypt to encrypt passwords
const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;

router.get("/", (req, res) => {
  res.render('index', {title: 'HOME'});
});

router.get("/signup", (req, res, next) => {
  res.render("auth/signup", {title: 'HOME'});
});

router.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username === "" || password === "") {
    res.render("auth/signup", {
      errorMessage: "Indicate a username and a password to sign up"
    });
    return;
  }

  User.findOne({ "username": username },
  "username",
  (err, user) => {
    if (user !== null) {
      res.render("auth/signup", {
        errorMessage: "The username already exists"
      });
      return;
    }

  let salt     = bcrypt.genSaltSync(bcryptSalt);
  let hashPass = bcrypt.hashSync(password, salt);

  let newUser  = User({
    username,
    password: hashPass
  });

  newUser.save((err) => {
    res.redirect("/");
  })
})
});

module.exports = router;
