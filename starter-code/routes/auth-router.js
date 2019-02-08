const express = require("express");

const bcrypt = require("bcrypt");

const User = require("../models/user-models.js");

const router = express.Router();

router.get("/private", (req, res, next) => {
  res.render("auth-views/private.hbs");
});

router.get("/signup", (req, res, next) => {
  res.render("auth-views/signup-form.hbs");
});

router.post("/process-signup", (req, res, next) => {
  const { username, originalPassword } = req.body;

  // enforce password rules (can't be empty)
  if (!originalPassword) {
    // req.flash sends feedback message before redirect
    // (it's defined by the "connect-flash" npm package)
    req.flash("error", "Password can't be blank.");
    //redirect to the SIGNUP PAGE if the password is BAD
    res.redirect("/signup");
    // use return to STOP the function here if the password is BAD
    return;
  }

  // // enforce password rules (unique name)
  // if (!username) {
  //   // req.flash sends feedback message before redirect
  //   // (it's defined by the "connect-flash" npm package)
  //   req.flash("error", "Username must be unique.");
  //   //redirect to the SIGNUP PAGE if the password is BAD
  //   res.redirect("/signup");
  //   // use return to STOP the function here if the password is BAD
  //   return;
  // }

  // encrypt the user's password before saving it
  const encryptedPassword = bcrypt.hashSync(originalPassword, 10);

  User.create({ username, encryptedPassword })
    .then(() => {
      // req.flash sends feedback message before redirect
      // (it's defined by the "connect-flash" npm package)
      req.flash("success", "Sign up successful! 👍");
      // redirect to the HOME PAGE if the sign up WORKED
      res.redirect("/");
    })
    .catch(err => next(err));
});

router.get("/login", (req, res, next) => {
  res.render("auth-views/login-form.hbs");
});

router.post("/process-login", (req, res, next) => {
  const { email, originalPassword } = req.body;

  User.findOne({ email: { $eq: email } })
    .then(userDoc => {
      if (!userDoc) {
        // req.flash sends feedback message before redirect
        // (it's defined by the "connect-flash" npm package)
        req.flash("error", "Email is incorrect.");
        // redirect to LOGIN PAGE if result is NULL (no account with that email)
        res.redirect("/login");
        // user return to STOP the function here if the PASSWORD is BAD
        return;
      }

      const { encryptedPassword } = userDoc;
      console.log(originalPassword, encryptedPassword);
      // validate the password by using bcrypt.compareSync()
      if (!bcrypt.compareSync(originalPassword, encryptedPassword)) {
        // req.flash sends feedback message before redirect
        // (it's defined by the "connect-flash" npm package)
        req.flash("error", "Password is incorrect.");
        // redirect to LOGIN PAGE if the password don't match
        res.redirect("/login");
        // user return to STOP the function here if the PASSWORD is BAD
        return;
      }

      // email & password are CORRECT!
      // HERE WE ARE MISSING SOME CODE FOR REAL LOG IN

      // req.flash sends feedback message before redirect
      // (it's defined by the "connect-flash" npm package)
      req.flash("success", "Log in successful! 👍");
      res.redirect("/private");
    })
    .catch(err => next(err));
});

module.exports = router;
