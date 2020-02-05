const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

router.get("/signup", (req, res, next) => {
  res.render("signup");
});

router.post("/signup", (req, res, next) => {
  const { username, password } = req.body;
  if (!username) {
    res.render("signup.hbs", {
      errorMessage: "Username cannot be empty"
    });
    return;
  }
  User.findOne({ username: username })
    .then(user => {
      if (user) {
        res.render("signup.hbs", {
          errorMessage: "Username already exists, please chose different"
        });
        return;
      }
      return bcrypt.hash(password, 10);
    })
    .then(hash => {
      return User.create({ username, password: hash });
    })
    .then(newUser => res.send(newUser))
    .catch(err => console.error(err));
});

router.get("/login", (req, res, next) => {
  res.render("login");
});

router.post("/login", (req, res, next) => {
  const { username, password } = req.body;
  if (!username) {
    res.render("login.hbs", {
      errorMessage: "Username cannot be empty"
    });
    return;
  }
  let user;
  User.findOne({ username })
    .then(foundUser => {
      if (!foundUser) {
        res.render("login.hbs", {
          errorMessage: "Username doesn't match any of our accounts"
        });
        return;
      }
      user = foundUser;
      return bcrypt.compare(password, foundUser.password);
    })
    .then(bool => {
      if (!bool) {
        res.render("login", { errorMessage: "Wrong password" });
        return;
      }
      req.session.user = user;
      res.redirect("/");
    })
    .catch(err => {
      console.error(err);
    });
});
router.get("/private", (req, res, next) => {
  if (!req.session.user) {
    res.render("main");
    return;
  }
  res.render("private");
});

router.get("/private", (req, res, next) => {
  if (!req.session.user) {
    res.redirect("/main");
    return;
  }
  res.render("private");
});

module.exports = router;
