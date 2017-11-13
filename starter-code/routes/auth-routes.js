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


  User.findOne({ "username": username }, (err, user) => {
        if (err || !user) {
          res.render("auth/login", {
            errorMessage: "The username doesn't exist"
          });
          return;
        }
        if (bcrypt.compareSync(password, user.password)) {
          // Save the login in the session!
          req.session.currentUser = user;
          res.redirect("/");
        } else {
          res.render("auth/login", {
            errorMessage: "Incorrect password"
          });
        }
    });
  });

  router.get("/login", (req, res) => {
    res.render("auth/login");
  });

module.exports = router;
