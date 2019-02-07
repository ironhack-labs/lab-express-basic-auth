const express = require("express");
const User = require("../models/user-model.js");
const router = express.Router();
const bcrypt = require("bcrypt");

router.get("/signup", (req, res, next) => {
  res.render("signup-form.hbs");
});

router.post("/process-signup", (req, res, next) => {
  const { username, originalPassword } = req.body;
  if (!originalPassword) {
    res.redirect("/signup");
    return;
  }
  const encryptedPassword = bcrypt.hashSync(originalPassword, 10);
  User.create({ username, encryptedPassword })
    .then(() => {
      console.log("user created");
      res.redirect("/");
    })
    .catch(err => next(err));
  console.log("user fail");
});

router.get("/login", (req, res, next) => {
  res.render("login-form.hbs");
});

router.post("/process-login", (req, res, next) => {
  const { username, originalPassword } = req.body;
  User.findOne({ username: { $eq: username } })
    .then(userDoc => {
      if (!userDoc) {
        res.redirect("/signup");
        return;
      }
      const { encryptedPassword } = userDoc;
      if (!bcrypt.compareSync(originalPassword, encryptedPassword)) {
        res.redirect("/signup");
      }
      res.redirect("/");
    })
    .catch(err => next(err));
});
module.exports = router;
