const express = require("express");
const bcrypt = require("bcrypt");
const Druglord = require("../models/druglords-model.js");
const router = express.Router();

router.get("/signup", (req, res, next) => {
  res.render("auth-views/signup-form.hbs");
});

router.post("/process-signup", (req, res, next) => {
  const { userName, originalPassword } = req.body;

  if (!originalPassword) {
    req.flash("error", "Password can't be blank");

    res.redirect("/signup");
    return;
  }

  const encryptedPassword = bcrypt.hashSync(originalPassword, 10);

  Druglord.create({ userName, encryptedPassword })
    .then(() => {
      req.flash("success", "Sign up success! 😃");

      res.redirect("/");
    })
    .catch(err => next(err));
});

router.get("/login", (req, res, next) => {
  res.render("auth-views/login-form.hbs");
});

router.post("/process-login", (req, res, next) => {
  const { userName, originalPassword } = req.body;

  Druglord.findOne({
    Username: { $eq: userName }
  })
    .then(userDoc => {
      if (!userDoc) {
        req.flash("error", "Username is incorrect. 🤦🏾‍♂️");

        res.redirect("/login");
        return;
      }

      const { encryptedPassword } = userDoc;
      if (!bcrypt.compareSync(originalPassword, encryptedPassword)) {
        req.flash("error", "Password is incorrect. 🤦🏾‍♂️");

        res.redirect("/login");
        return;
      }

      req.flash("success", "Log in success. 😎");
      res.redirect("/");
    })
    .catch(err => next(err));
});

module.exports = router;
