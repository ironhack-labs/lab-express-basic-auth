const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");

router.get("/signup", (req, res, next) => {
  res.render("signup.hbs");
});

router.get("/login", (req, res, next) => {
  res.render("login.hbs");
});

router.get("/logout", (req, res, next) => {
  req.session.destroy(err => {
    if (err) next(err);
    res.redirect("/");
  });
});

router.get("/private", (req, res, next) => {
  if (req.session.user) {
    res.render("private.hbs", { user: req.session.user });
  } else {
    res.redirect("/");
  }
});

router.get("/main", (req, res, next) => {
  if (req.session.user) {
    res.render("main.hbs", { user: req.session.user });
  } else {
    res.redirect("/");
  }
});

router.post("/login", (req, res, next) => {
  const { username, password } = req.body;
  let user;

  User.findOne({ username: username })
    .then(foundUser => {
      if (!foundUser) {
        res.render("login.hbs", {
          errorMessage: "Invalid credentials"
        });
        return;
      }
      user = foundUser;

      return bcrypt.compare(password, foundUser.password);
    })
    .then(match => {
      if (!match) {
        res.render("login.hbs", {
          errorMessage: "Invalid credentials"
        });
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
      errorMessage: "Username cannot be empty"
    });
    return;
  }
  if (!password) {
    res.render("signup.hbs", { errorMessage: "Password cannot be empty" });
    return;
  }

  User.findOne({ username: username })
    .then(user => {
      if (user) {
        res.render("signup.hbs", { errorMessage: "Username already taken" });
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
