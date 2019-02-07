const express = require("express");
const User = require("../models/Users.js");
const router = express.Router();
module.exports = router;
const bcrypt = require("bcrypt");
// const strength = require("jquery-strength");
// module.exports = strength;

router.get("/signup", (req, res, next) => {
  res.render("auth/signup-form.hbs");
});

router.post("/process-signup", (req, res, next) => {
  const { username, originalPassword } = req.body;

  // username: { type: String, required: true, unique: true },
  // password: { type: String, required: true }

  if (!username) {
    // send flash message giving user info about the problem
    req.flash("error", "must have username, obviii");

    res.redirect("/signup");
    return;
  }

  if (!originalPassword) {
    // send flash message giving user info about the problem
    req.flash("error", "must have password, obviii");

    res.redirect("/signup");
    return;
  }

  const encryptedPassword = bcrypt.hashSync(originalPassword, 10);

  User.create({ username, encryptedPassword })
    .then(userDoc => {
      req.flash("success", "great success!");
      res.redirect("/");
    })
    .catch(err => next(err));
});

router.get("/login", (req, res, next) => {
  res.render("auth/login-form.hbs");
});

router.post("/process-login", (req, res, next) => {
  const { username, originalPassword } = req.body;

  // username: { type: String, required: true, unique: true },
  // password: { type: String, required: true }

  if (!username) {
    // send flash message giving user info about the problem
    req.flash("error", "must have username, obviii");

    res.redirect("/login");
    return;
  }

  if (!originalPassword) {
    // send flash message giving user info about the problem
    req.flash("error", "must have password, obviii");

    res.redirect("/login");
    return;
  }

  User.findOne({ username: { $eq: username } })
    .then(userDoc => {
      if (!userDoc) {
        req.flash("error", "wrong username, fool");
        res.redirect("/login");
        return;
      }

      const { encryptedPassword } = userDoc;
      if (!bcrypt.compareSync(originalPassword, encryptedPassword)) {
        req.flash("error", "wrong password, lol");
        res.redirect("/login");
      }

      req.flash("success", "congrats on logging in!");
      res.redirect("/private");
    })
    .catch(err => next(err));
});

router.get("/private", (req, res, next) => {
  res.render("private.hbs");
});
