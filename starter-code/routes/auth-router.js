const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const User = require("../models/user-model.js");

// we're saying that the sign-up form will go to auth-views folder inside views
router.get("/signup", (req, res, next) => {
  res.render("auth-views/signup-form.hbs");
});

router.post("/process-signup", (req, res, next) => {
  const { userName, originalPassword } = req.body;

  // enforce pwd rules
  if (!originalPassword || !originalPassword.match(/[0-9]/)) {
    req.flash("error", "Password can't be blank and must contain a number");

    res.redirect("/signup");
    return;
  }

  //encrypt the user's pwd before saving it
  const encryptedPassword = bcrypt.hashSync(originalPassword, 10);

  User.create({ userName, encryptedPassword })
    .then(() => {
      req.flash("success", "Sign up success!");

      res.redirect("/");
    })
    .catch(err => next(err));
});

router.get("/login", (req, res, next) => {
  res.render("auth-views/login-form.hbs");
});

router.post("/process-login", (req, res, next) => {
  const { userName, originalPassword } = req.body;

  User.findOne({ userName: { $eq: userName } })
    .then(userDoc => {
      // if userDoc is empty (userDoc is the result of the search, it means it didn't find anything)
      if (!userDoc) {
        req.flash("error", "the Username provided is incorrect!");
        res.redirect("/login");

        return;
      }
      // validate the pwd by using bcrypt.compareSync

      const { encryptedPassword } = userDoc;
      if (!bcrypt.compareSync(originalPassword, encryptedPassword)) {
        req.flash("error", "the Password provided is incorrect");
        // redirect to login page if the passwords don't match
        res.redirect("/login");
        return;
      }
      req.flash("success", "Log in success!");
      res.redirect("/");
    })

    .catch(err => next(err));
});

module.exports = router;
