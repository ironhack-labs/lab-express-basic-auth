const express = require("express");
const router = express.Router();
const path = require("path");
const debug = require('debug')('basic-auth:' + path.basename(__filename));

// User model
const User = require("../models/User");

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

router.get('/', (req, res) => {
  res.render('index');
});

router.get("/signup", (req, res) => {
  res.render("auth/signup");
});

router.post('/signup', (req, res, next) => {
  console.log("entrando al post signup");

  const username = req.body.username;
  const password = req.body.password;

  if (username === "" || password === "") {
    res.render('auth/signup', {
      errorMessage: "Indicate a username and a password to sign up"
    });
    return;
  }

  User.findOne({
    "username": username
  }, "username", (err, user) => {
    if (user !== null) {
      res.render("auth/signup", {
        errorMessage: "The username already exists"
      });
      return;
    }

    var salt = bcrypt.genSaltSync(bcryptSalt);
    var hashPass = bcrypt.hashSync(password, salt);

    var newUser = User({
      username,
      password: hashPass
    });

    newUser.save((err) => {
      if (err) {
        res.render("auth/signup", {
          errorMessage: "Something went wrong when signing up"
        });
      } else {
        req.session.currentUser = user;
        res.redirect('/');
      }
    });
  });
});

module.exports = router;
