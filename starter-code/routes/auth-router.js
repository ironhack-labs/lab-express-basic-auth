const express = require("express");
const User = require("../models/user-model.js");
const bcrypt = require("bcrypt");

const router = express.Router();

router.get("/signup", (req, res, next) => {
  res.render("auth-views/signup-form.hbs");
});

router.post("/process-signup", (req, res, next) => {
  const { userName, originalPassword } = req.body;

  // // enforce password rules
  if (!originalPassword) {
    // req.flash sends a feedback message before a redirect
    // (it's defined by the "connect-flash" npm package)
    // req.flash("error", "Password can't be blank and must contain a number");

    // redirect to the SIGNUP PAGE if the password is BAD
    res.redirect("/signup");
    // use return to STOP the function here if the password is BAD
    return;
  }

  // encrypt the user's password before saving
  const encryptedPassword = bcrypt.hashSync(originalPassword, 10);

  User.create({ userName, encryptedPassword })
    .then(() => {
      // req.flash sends a feedback message before a redirect
      // (it's defined by the "connect-flash" npm package)
      req.flash("success", "Sign up success !");

      // redirect to the HOME PAGE if the sign up WORKED
      res.redirect("/");
    })
    .catch(err => next(err));
});

router.get("/login", (req, res, next) => {
  res.render("auth-views/login-form.hbs");
});

router.post("/process-login", (req, res, next) => {
  const { userName, originalPassword } = req.body;

  // validate the email by searching the datanase for an account with that email
  User.findOne({ userName: { $eq: userName } })
    .then(userDoc => {
      // User.findOne() will give us NULL in userDoc if it found nothing
      if (!userDoc) {
        // req.flash sends a feedback message before a redirect
        // (it's defined by the "connect-flash" npm package)
        req.flash("error", "Username is incorrect");

        // redirect to login page if result is NULL (no account with the email)
        res.redirect("/login");
        // use return to STOP the function here if the email is BAD
        return;
      }

      const { encryptedPassword } = userDoc;

      // validate the password by using bcrypt.compareSync()
      if (!bcrypt.compareSync(originalPassword, encryptedPassword)) {
        // req.flash sends a feedback message before a redirect
        // (it's defined by the "connect-flash" npm package)
        req.flash("error", "Password is incorrect");

        // redirect to LOGIN PAGE if the passwords don't match
        res.redirect("/login");
        // use return to STOP the function here if the password is BAD
        return;
      }
      // req.flash sends a feedback message before a redirect
      // (it's defined by the "connect-flash" npm package)
      req.flash("success", "You are logged in !");

      // email & password are CORRECT !
      // HERE WE ARE MISSING SOME CODE FOR REAL LOG IN
      res.redirect("/");
    })
    .catch(err => next(err));
});

module.exports = router;
