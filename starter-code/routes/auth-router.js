const express = require("express");
const User = require("../models/user-model.js");
const router = express.Router();
const bcrypt = require("bcrypt");

router.get("/signup", (req, res, next) => {
  res.render("auth-views/signup-form.hbs");
});

router.post("/process-signup", (req, res, next) => {
  const { username, originalPassword } = req.body;

  if (!username || !originalPassword) {
    req.flash("error", "The fields cannot be empty");
    res.redirect("/signup");
    return;
  }

  const encryptedPassword = bcrypt.hashSync(originalPassword, 10);

  User.findOne({ username: { $eq: username } })
    .then(userDoc => {
      if (!userDoc) {
        User.create({ username, encryptedPassword })
          .then(() => {
            req.flash("success", "You signed up successfully");
            res.redirect("/");
          })
          .catch(err => next(err));
      } else {
        req.flash("error", "This username already exists");
        res.redirect("/signup");
        return;
      }
    })
    .catch();
});

router.get("/login", (req, res, next) => {
  res.render("auth-views/login-form.hbs");
});

router.post("/process-login", (req, res, next) => {
  const { username, originalPassword } = req.body;

  User.findOne({ username: { $eq: username } })
    .then(userDoc => {
      if (!userDoc) {
        req.flash("error", "This username doesn't exist");
        res.redirect("/login");
        return;
      }
      const { encryptedPassword } = userDoc;
      if (!bcrypt.compareSync(originalPassword, encryptedPassword)) {
        req.flash("error", "Your password is wrong");
        res.redirect("/login");
        return;
      }
      req.flash("success", "You logged in successfully");
      res.redirect("/");
    })
    .catch(err => next(err));
});

module.exports = router;
