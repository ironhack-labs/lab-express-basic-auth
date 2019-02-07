const express = require("express");
const bcrypt = require("bcrypt");

const User = require("../models/user-model.js");

const router = express.Router();

router.get("/signup", (req, res, next) => {
  res.render("auth-views/signup-form.hbs");
});

router.post("/process-signup", (req, res, next) => {
  const { userName, originalPassword } = req.body;

  // if (!userName) {
  //   // req.flash() sends a feedback message before a redirect
  //   // (it's defined by the "connect-flash" npm package
  //   req.flash("error", "Usernames can't be blank.");
  //   // redirect to the SIGNUP PAGE if the password is BAD
  //   res.redirect("/signup");
  //   return;
  // }

  // enforce password rules (can't be EMPTY and MUST have a digit)
  if (!originalPassword || !originalPassword.match(/[0-9]/)) {
    // req.flash() sends a feedback message before a redirect
    // (it's defined by the "connect-flash" npm package
    req.flash("error", "Password can't be blank and must contain a number.");
    // redirect to the SIGNUP PAGE if the password is BAD
    res.redirect("/signup");
    return;
  }

  // encrypt the user's password before saving
  const encryptedPassword = bcrypt.hashSync(originalPassword, 10);
  User.create({ userName, encryptedPassword })
    .then(() => {
      // req.flash() sends a feedback message before a redirect
      // (it's defined by the "connect-flash" npm package)
      req.flash("success", "Sign up success!");
      // redirect to the HOME PAGE if the sign up worked
      res.redirect("/");
    })
    .catch(err => next(err));
});

router.get("/login", (req, res, next) => {
  res.render("auth-views/login-form.hbs");
});

router.post("/process-login", (req, res, next) => {
  const { userName, originalPassword } = req.body;

  // validate the userName by searching the database for an account with that userName
  User.findOne({ userName: { $eq: userName } })
    .then(userDoc => {
      if (!userDoc) {
        // req.flash() sends a feedback message before a redirect
        // (it's defined bt the "connect-flash" npm package)
        req.flash("error", "Username is incorrect.");
        // redirect to LOGIN PAGE if result is NULL (no account with the userName)
        res.redirect("/login");
        // use return to STOP the function here if the userName is BAD
        return;
      }

      // validate the password by using bcrypt.comparSync()
      const { encryptedPassword } = userDoc;

      if (!bcrypt.compareSync(originalPassword, encryptedPassword)) {
        req.flash("error", "Password is incorrect.");
        // redirect to LOGIN PAGE if the passwords don't match
        res.redirect("/login");
        // use return to STOP the function here if the PASSWORD is BAD
        return;
      }
      // userName & password are CORRECT!
      // HERE WE ARE MISSING SOME CODE FOR REAL LOG IN
      req.flash("success", "Log in success!");
      res.redirect("/");
    })
    .catch(err => next(err));
});

module.exports = router;
