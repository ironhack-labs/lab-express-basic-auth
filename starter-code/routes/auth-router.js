const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/user-model.js");
const router = express.Router();


router.get("/signup", (req, res, next) => {
  res.render("auth-views/signup-form.hbs");
});

router.post("/process-signup", (req, res, next) => {
  const { userName, originalPassword } = req.body;

  if (!originalPassword || userName === null) {
    req.flash("error", "User Name and Password can't be blank");
    res.redirect("/signup");
    return;
  }
  const encryptedPassword = bcrypt.hashSync(originalPassword, 10);

  User.create({ userName, encryptedPassword})
  .then(userDoc => {
    req.flash("success", "Signup success! Welcome beauty!");
    res.redirect("/");
  })
  .catch(err => next(err));
});

router.get("/login", (req, res, next) => {
  res.render("auth-views/login-form.hbs");
});

router.post("/process-login", (req, res, next) => {
  const { userName, originalPassword } = req.body;

  User.findOne({ userName: { $eq: userName}})
  .then(userDoc => {
    if(!userDoc) {
      req.flash("error", "You user name is wrong, please check it");
      res.redirect("/login");
    }
    const { encryptedPassword } = userDoc;
    if (!bcrypt.compareSync(originalPassword, encryptedPassword)) {
      req.flash("error", "Please verify your password");
      res.redirect("/login");
    } else {
      req.flash("success", "Welcome back Darling ;)");
      res.redirect("/");
    }
  })
  .catch(err => next(err));
})

module.exports = router;