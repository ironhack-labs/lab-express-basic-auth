const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");
const zxcvbn = require("zxcvbn");

// SIGN UP
router.get("/signup", (req, res, next) => {
  res.render("signup");
});

router.post("/signup", (req, res, next) => {
  const { username, password } = req.body;

  if (!username) {
    res.render("signup", { errorMessage: "Username cannot be empty" });
    return;
  }

  if (password.length < 8) {
    res.render("signup", {
      errorMessage: "Password needs to be at least 8 characters"
    });
    return;
  }
  let info = zxcvbn(password);
  if (info.score < 3) {
    res.render("signup", { errorMessage: info.feedback.suggestions[0] });
    return;
  }

  // console.log("info: ", info);

  User.findOne({ username })
    .then(user => {
      if (user) {
        res.render("signup", { errorMessage: "Username already taken" });
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
      console.log(err);
    });
});

// LOG IN
router.get("/login", (req, res, next) => {
  res.render("login");
});

router.post("/login", (req, res, next) => {
  const { username, password } = req.body;
  let user;

  User.findOne({ username })
    .then(foundUser => {
      if (!foundUser) {
        // if username is not found
        res.render("login", { errorMessage: "Invalid credentials" });
        return;
      }
      // If username IS found, then compare hashes:
      user = foundUser;
      return bcrypt.compare(password, foundUser.password);
    })
    .then(match => {
      // If hashes don't match:
      if (!match) {
        res.render("login", { errorMessage: "Invalid credentials" });
        return;
      }
      // If hashes DO match, start a session for the user:
      req.session.user = user;
      res.redirect("/");
    });
});

// LOG OUT
router.get("/logout", (req, res, next) => {
  console.log("NO MORE LOGIN!!! ");
  req.session.destroy(err => {
    if (err) next(err);
    res.redirect("/");
  });
});

// PROTECTED BY AUTHENTICATION
router.get("/main", (req, res, next) => {
  if (!req.session.user) {
    res.redirect("/");
    return;
  }

  res.render("main");
});

router.get("/private", (req, res, next) => {
  if (!req.session.user) {
    res.redirect("/");
    return;
  }

  res.render("private");
});

module.exports = router;
