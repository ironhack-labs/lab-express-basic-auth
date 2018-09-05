const express = require("express");
const bcrypt = require("bcrypt");

const User = require("../models/user-model.js");

const router = express.Router();

router.get("/signup", (req, res, next) => {
  res.render("auth/signup-form.hbs");
});

router.get("/login", (req, res, next) => {
  res.render("auth/login-form.hbs");
});

router.get("/private", (req, res, next) => {
  res.render("auth/private.hbs");
});

router.get("/main", (req, res, next) => {
  res.render("auth/main.hbs");
});

router.post("/process-signup", (req, res, next) => {
  // res.send(req.body); uncomment this one and COMMENT the other one to render info on page.
  const { username, originalPassword } = req.body;

router.get((req, res, next) => {
    
});
  
  router.get("/private", (req, res, next) => {
    if (req.session.currentUser) {
      next();
    } else {
      res.redirect("/login");
    }
    res.render("private");
  });

  // encrypt the submitted password
  const encryptedPassword = bcrypt.hashSync(originalPassword, 10);
  User.create({ username, encryptedPassword })
    .then(userDoc => {
      
      // save a flash message to display in the HOME page
      // req.flash("success", "Sign up success! 🖖🏾");
      res.redirect("/")
    })
    .catch(err => next(err));
});



router.post("/process-login", (req, res, next) => {
  const { username, originalPassword } = req.body;

  // first check to see if there's a document with that email
  User.findOne({ username: { $eq: username } })
    .then(userDoc => {
      // "userDoc" will be empty if the email is wrong (no document in database)
      if (!userDoc) {
        // save a flash message to display in the LOGIN page
        // req.flash("error", "Incorrect username. 🤦‍♂️");
        res.redirect("/main");
        return; // use "return" instead of a big "else {}"
      }

      // second check the password
      const { encryptedPassword } = userDoc;
      // "compareSync()" will return false if the "originalPassword" is wrong
      if (!bcrypt.compareSync(originalPassword, encryptedPassword)) {
        // save a flash message to display in the LOGIN page
        // req.flash("error", "Password is wrong. ️🤯");
        req.session.currentUser = userDoc;
        res.redirect("/main");
        return;
      }
      // save a flash message to display in the HOME page
      // req.flash("success", "Log in success! 🧙‍♀️");
      // go to the home page if password is GOOD (log in worked!)
      res.redirect("/private");
    })
    .catch(err => next(err));
});





module.exports = router;