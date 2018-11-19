const express = require('express');
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcryptjs");



router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});


router.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username === "" || password === "") {
    res.render("auth/signup", {
      errorMessage: "Indicate an username and a password"
    });
    return;
  } else {
    User.findOne({"username": username}, "username",
      (err, user) => {
        if (user !== null) {
          res.render("auth/signup", {
            errorMessage: "The username already exists"
          });
          return;
        }
      const salt = bcrypt.genSaltSync(10);
      const hashPass = bcrypt.hashSync(password, salt);
      const newUser = User({
        username,
        password: hashPass
      });
      newUser.save((err) => {
        if (err) {
          res.render("auth/signup", {
            errorMessage: "Something went wrong"
          });
        } else {
          res.redirect("/");
        }
      });
    });
  }
});


router.get("/login", (req, res, next) => {
  res.render("auth/login");
});


router.post("/login", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username === "" || password === "") {
    res.render("auth/login", {
      errorMessage: "Indicate a username and a password"
    });
    return;
  }

  User.findOne({ "username": username }, (err, user) => {
    if (err || !user) {
      res.render("auth/login", {
        errorMessage: "The username or password are incorrect"
      });
      return;
    }
    if (bcrypt.compareSync(password, user.password)) {
      // Save the login in the session!
      req.session.currentUser = user;
      res.redirect("/private");
    } else {
      res.render("auth/login", {
        errorMessage: "The username or password are incorrect"
      });
    }
  });
});


router.get("/logout", (req, res, next) => {
  req.session.destroy((err) => {
    res.redirect("/");
  });
});

module.exports = router;
