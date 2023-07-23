const express = require("express");
const router = express.Router();

const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

const saltRounds = 10;
const User = require("../models/User.model");

router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

router.post("/signup", (req, res, next) => {
  const { email, password } = req.body;

  if (email === "" || password === "")
    res.status(400).render("auth/signup", {
      errorMessage: "Email and Password are mandatory fields.",
      email,
    });
  else {
    bcrypt
      .genSalt(saltRounds)
      .then((salt) => bcrypt.hash(password, salt))
      .then((passwordHash) => {
        return User.create({ email, passwordHash });
      })
      .then((user) => {
        res.render("users/user-profile", { user });
      })
      .catch((err) => {
        if (err.code === 11000) {
          res.render("auth/signup", {
            errorMessage: "Email already exists.",
            email,
          });
        }
      });
  }
});

router.get("/login", (req, res) => res.render("auth/login"));

router.post("/login", (req, res, next) => {
  const { email, password } = req.body;

  if (email === "" || password === "") {
    res.render("auth/login", {
      errorMessage: "Please enter both, email and password to login.",
      email,
    });
    return;
  }

  User.findOne({ email })
    .then((user) => {
      if (!user) {
        res.render("auth/login", {
          errorMessage: "Email is not registered. Try with other email.",
          email,
        });
        return;
      } else if (bcrypt.compareSync(password, user.passwordHash)) {
        res.render("users/user-profile", { user });
      } else {
        res.render("auth/login", {
          errorMessage: "Incorrect password.",
          email,
        });
      }
    })
    .catch((error) => next(error));
});

module.exports = router;
