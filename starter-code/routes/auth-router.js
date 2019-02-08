const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/User.js");
const router = express.Router();

router.get("/signup", (req, res, next) => {
  res.render("auth-views/signup-form.hbs");
});

router.post("/process-signup", (req, res, next) => {
  const { username, originalPassword } = req.body;

  if (username === "" || originalPassword === "") {
    req.flash("error", "Username or password can't be blank");
    res.redirect("/signup");
    return;
  }

  if (!originalPassword.match(/[0-9]/)) {
    req.flash("error", "Password must contain a number");
    res.redirect("/signup");
    return;
  }

  const encryptedPassword = bcrypt.hashSync(originalPassword, 10);

  User.create({ username, encryptedPassword })
    .then(() => {
      req.flash("success", "Sign up success! 🙂");
      res.redirect("/");
    })
    .catch(err => next(err));
});

router.get("/login", (req, res, next) => {
  res.render("auth-views/login-form.hbs");
});

router.post("/process-login", (req, res, next) => {
  const { username, originalPassword } = req.body;

  if (username === "" || originalPassword === "") {
    req.flash("error", "Username or password can't be blank");
    res.redirect("/login");
    return;
  }

  User.findOne({ username: { $eq: username } })
    .then(userDoc => {
      if (!userDoc) {
        req.flash("error", "Username is incorrect.");
        res.redirect("/login");
        return;
      }

      const { encryptedPassword } = userDoc;

      if (!bcrypt.compareSync(originalPassword, encryptedPassword)) {
        req.flash("error", "Password is incorrect.");
        res.redirect("/login");
        return;
      }

      req.session.currentUser = userDoc;
      req.flash("success", "Log in success");
      res.redirect("/");
    })
    .catch(err => next(err));
});

router.get("/logout", (req, res, next) => {
  req.session.destroy(err => {
    // can't access session here
    res.redirect("/login");
  });
});

module.exports = router;
