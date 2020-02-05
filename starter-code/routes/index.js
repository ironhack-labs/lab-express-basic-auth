const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

router.get("/home", (req, res, next) => {
  res.render("home", { user: req.session.user });
});

router.get("/login", (req, res, next) => {
  res.render("login");
});

router.get("/main", (req, res, next) => {
  res.render("main", { user: req.session.user });
});

router.get("/private", (req, res, next) => {
  res.render("private", { user: req.session.user });
});

router.post("/", (req, res, next) => {
  const { username, password } = req.body;
  if (!username) {
    res.render("index.hbs", { errorMessage: "Please fill the username field" });
    return;
  }
  if (!password) {
    res.render("index.hbs", { errorMessage: "Please fill the password field" });
    return;
  }
  User.findOne({ username: username })
    .then(user => {
      if (user) {
        res.render("index.hbs", {
          errorMessage: "This username already exists"
        });
        return;
      }
      return bcrypt.hash(password, 10);
    })
    .then(hash => {
      return User.create({ username: username, password: hash });
    })
    .then(createdUser => {
      req.session.user = createdUser;
      res.redirect("/home");
    })
    .catch(err => next(err));
});

router.post("/login", (req, res, next) => {
  const { username, password } = req.body;
  if (!username) {
    res.render("index.hbs", { errorMessage: "Please fill the username field" });
    return;
  }
  if (!password) {
    res.render("index.hbs", { errorMessage: "Please fill the password field" });
    return;
  }
  let user;

  User.findOne({ username: username })
    .then(foundUser => {
      if (!foundUser) {
        res.render("login.hbs", {
          errorMessage: "Invalid username"
        });
        return;
      }
      user = foundUser;
      return bcrypt.compare(password, foundUser.password);
    })
    .then(match => {
      if (!match) {
        res.render("login.hbs", {
          errorMessage: "Wrong password"
        });
        return;
      }
      req.session.user = user;
      res.redirect("/home");
    })
    .catch(err => next(err));
});

module.exports = router;
