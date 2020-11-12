const express = require("express");
const User = require("../models/User.model");
const router = express.Router();
const bcrypt = require("bcrypt");
const saltRounds = 10;
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
        .then((newUser) => {
          res.redirect("/login");
        })
        .catch((err) =>
          res.render("signup", {
            errorMessage: "The username or email address is already in use.",
          })
        );
    })
    .catch((err) => console.error(err));
});

router.get("/login", (req, res) => {
  res.render("auth/login");
});

router.post("/login", (req, res) => {
  const { username, password } = req.body;
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

module.exports = router;
