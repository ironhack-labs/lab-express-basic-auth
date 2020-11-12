const express = require("express");
const User = require("../models/User.model");
const router = express.Router();
const bcrypt = require("bcrypt");
const saltRounds = 12;
const mongoose = require("mongoose");

router.get("/signup", (req, res) => {
  res.render("auth/signup");
});

router.post("/signup", (req, res) => {
  const { username, email, password } = req.body;
  bcrypt
    .hash(password, saltRounds)
    .then((hashedPassword) => {
      User.create({ username, email, passwordHash: hashedPassword })
        .then((user) => {
          req.session.currentUser = user;
          res.redirect("/user-profile");
        })
        .catch((err) => {
          res.render("auth/signup", {
            errorMessage: "The username or email address is already in use.",
          });
        });
    })
    .catch((err) => console.error(err));
});

router.get("/login", (req, res) => {
  res.render("auth/login");
});

router.post("/login", (req, res) => {
  const { username, password } = req.body;
  console.log(username, password);
  User.findOne({ username })
    .then((user) => {
      if (!user) {
        res.render("auth/login", {
          errorMessage: `Username not found. Please try again.`,
        });
        return;
      } else if (bcrypt.compareSync(password, user.passwordHash)) {
        req.session.currentUser = user;
        res.redirect("/user-profile");
      } else {
        res.render("auth/login", { errorMessage: "Incorrect password." });
      }
    })
    .catch((err) => {
      console.error(err);
    });
});
router.get("/user-profile", (req, res) => {
  res.render("users/user-profile", { userInSession: req.session.currentUser });
});

router.get("/main", (req, res) => {
  if (req.session.currentUser) {
    res.render("main", { userInSession: req.session.currentUser });
  } else {
    res.render("auth/login", {
      errorMessage: `Please log in first.`,
    });
  }
});

router.get("/private", (req, res) => {
  if (req.session.currentUser) {
    res.render("private", { userInSession: req.session.currentUser });
  } else {
    res.render("auth/login", {
      errorMessage: `Please log in first.`,
    });
  }
});

router.post("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

module.exports = router;
