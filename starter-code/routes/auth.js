const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");

router.get("/signup", (req, res, next) => {
  res.render("signup.hbs");
});

router.get("/main", (req, res) => {
  res.render("cat.hbs");
});

router.get("/private", (req, res) => {
  res.render("stuff.hbs");
});

router.get("/logout", (req, res, next) => {
  req.session.destroy(err => {
    if (err) next(err);
    res.redirect("/");
  });
});

router.post("/login", (req, res, next) => {
  const { username, password } = req.body;

  let user;

  User.findOne({ username: username })
    .then(foundUser => {
      if (!foundUser) {
        res.render("login.hbs", { errorMessage: "invalid" });
        return;
      }

      user = foundUser;

      return bcrypt.compare(password, foundUser.password);
    })
    .then(match => {
      if (!match) {
        res.render("login.hbs", { errorMessage: "invalid" });
        return;
      }
      req.session.user = user;
      res.redirect("/");
    })
    .catch(err => {
      next(err);
    });
});

router.post("/signup", (req, res, next) => {
  const { username, password } = req.body;

  if (!username) {
    res.render("signup.hbs", {
      errorMessage: "Type something"
    });
    return;
  }
  if (password.length < 1) {
    res.render("signup.hbs", {
      errorMessage: "Type something"
    });
    return;
  }

  User.findOne({ username: username })
    .then(user => {
      if (user) {
        res.render("signup.hbs", {
          errorMessage: "username already taken"
        });
        return;
      }

      return bcrypt.hash(password, 10);
    })
    .then(hash => {
      return User.create({ username: username, password: hash });
    })
    .then(createdUser => {
      console.log(createdUser);
      req.session.user = createdUser;
      res.redirect("/");
    })
    .catch(err => {
      next(err);
    });
});

module.exports = router;
