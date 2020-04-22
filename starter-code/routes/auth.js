const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");

/* GET home page */
router.get("/signup", (req, res, next) => {
  res.render("signup");
});
router.get("/login", (req, res, next) => {
  res.render("login");
});

router.get("/logout", (req, res, next) => {
  req.session.destroy((err) => {
    if (err) next(err);
    else res.render("logout");
  });
});

router.post("/signup", (req, res, next) => {
  const { username, password } = req.body;
  if (username === "" || password === "") {
    res.render("signup", { message: "One of the fields are empty" });
  }
  if (password.length < 10) {
    res.render("signup", {
      message: "Your password cannot be less than 8 characters",
    });
  }
  User.findOne({ username: username }).then((found) => {
    if (found !== null) {
      res.render("signup", { message: "Username is already taken" });
    } else {
      const salt = bcrypt.genSaltSync();
      const hash = bcrypt.hashSync(password, salt);
      User.create({ username: username, password: hash })
        .then((data) => {
          res.redirect("/login");
        })
        .catch((err) => {
          next(err);
        });
    }
  });
});

router.post("/login", (req, res, next) => {
  const { username, password } = req.body;
  User.findOne({ username })
    .then((foundData) => {
      if (foundData === null) {
        res.render("login", { message: "Invalid Credentials" });
      }
      const passwordCheck = bcrypt.compareSync(password, foundData.password);
      if (passwordCheck) {
        req.session.user = foundData;
        res.redirect("/profile");
      } else {
        res.render("login", { message: "Invalid Credentials" });
      }
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = router;
