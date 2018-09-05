const express = require("express");
const bcrypt = require("bcrypt");

const User = require("../models/user-model.js");

const router = express.Router();

// --------SIGNUP ROUTES---------------------------------
router.get("/signup", (req, res, next) => {
  res.render("auth-views/signup-form.hbs");
});

router.post("/process-signup", (req, res, next) => {
  const { username, originalPassword } = req.body;
  // encrypt the submitted password
  const encryptedPassword = bcrypt.hashSync(originalPassword, 10);

  User.create({ username, encryptedPassword })
    .then(userDoc => {
      // save a flash message to display in the HOME page
      // req.flash("success", "Sign up success ✌️");
      res.redirect("/");
    })
    .catch(err => next(err));
});

// -----------LOGIN ROUTES-------------------------------
router.get("/login", (req, res, next) => {
  res.render("auth-views/login-form.hbs");
});

router.post("/process-login", (req, res, next) => {
  const { username, originalPassword } = req.body;

  User.findOne({ username: { $eq: username } })
    .then(userDoc => {
      if (!userDoc) {
        req.flash("error", "Incorrect email 🤦");
        res.redirect("/login");
        return;
      }
      const { encryptedPassword } = userDoc;
      if (!bcrypt.compareSync(originalPassword, encryptedPassword)) {
        req.flash("error", "Password is wrong 🤯");
        res.redirect("/login");
        return;
      }
      req.flash("success", "Sign up success ✌️");
      res.redirect("/");
    })
    .catch(err => next(err));
});

module.exports = router;
