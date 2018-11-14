const express = require("express");
const bcrypt = require("bcrypt");

const User = require("../models/user-model.js");

const router = express.Router();

router.get("/signup", (req, res, next) => {
  res.render("auth-views/signup-form.hbs");
});

router.post("/process-signup", (req, res, next) => {
  const { username, originalPassword } = req.body;
  if (!originalPassword || originalPassword.match(/[0-9]/) === null) {
    req.flash("error", "Password can't be blank and must contain a number");
    res.redirect("/signup");
    return;
  }
  const encryptedPassword = bcrypt.hashSync(originalPassword, 10);

  User.create({username, encryptedPassword })
    .then(userDoc => {
      req.flash("success", "Signup success 🤸🏾‍")
      res.redirect("/");
    })
    .catch(err => next(err));
});

router.get("/login", (req, res, next) => {
  res.render("auth-views/login-form.hbs");
});

router.post("/process-login", (req, res, next) => {
  const { username, originalPassword } = req.body;

  User.findOne({ username: { $eq: username }})
    .then(userDoc => {

      if (!userDoc) {
        req.flash("error", "Incorrect email. 🧘🏻‍");
        res.redirect("/login");
        return; 
      }
      const { encryptedPassword } = userDoc;
      if (!bcrypt.compareSync(originalPassword, encryptedPassword)) {
        req.flash("error", "Incorrect password. 🤕");
        res.redirect("/login");
      }
      else {
        req.flash("success", "Log in success! 🤜✨🤛 ")
        res.redirect("/");
      }
    })
    .catch(err => next(err));
});

router.get("/main", (req, res, next) => {
  
  res.render("auth-views/main-page.hbs");
});

router.get("/private", (req, res, next) => {
  
  res.render("auth-views/private-page.hbs");
});


module.exports = router;