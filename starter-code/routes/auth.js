const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const bcryptSalt = 10;
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
    res.redirect("login.hbs");
  });
});

router.post("/login", (req, res, next) => {
  const { username, password } = req.body;
  let user;

  User.findOne({ username: username })
    .then(foundUser => {
      if (!foundUser) {
        res.render("signup.hbs", {
          errorMessage: "Invalid credentials"
        });
        return;
      }

      user = foundUser;

      return bcrypt.compare(password, foundUser.password);
    })
    .then(match => {
      if (!match) {
        res.render("signup.hbs", { errorMessage: "Invalid credentials" });
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
  if (password.length < 6) {
    res.render("signup.hbs", {
      errorMessage: "Password must be 6 char. min"
    });
    return;
  }
  User.findOne({ username: username })
    .then(user => {
      if (user) {
        res.render("signup.hbs", {
          errorMessage: "Username already taken"
        });
        return;
      }
      return bcrypt.hash(password, bcryptSalt);
    })
    .then(hash => {
      return User.create({ username: username, password: hash });
    })
    .then(createdUser => {
      req.session.user = createdUser;
      res.redirect("/");
    })
    .catch(err => {
      next(err);
    });
});

module.exports = router;
