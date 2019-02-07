// SETUP CONST & REQUIREMENTS
// ------------------------------------
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/auth-model.js');



// Sign up route and DB work :
// ------------------------------------

// Route
router.get("/signup", (req, res, next) => {
  res.render('auth-form.hbs');
});


// DB user creation
router.post("/process-signup", (req, res, next) => {
  const {
    userName,
    originalUserPass,
  } = req.body

  //if password is not in good format
  if (!originalUserPass || !originalUserPass.match(/[0-9]/)) {
    req.flash("error", "Password can't be blank and must have a digit, ❌");
    res.redirect('/signup');
    return;
  }
  const encryptedUserPass = bcrypt.hashSync(originalUserPass, 10);

  User.create({
      userName,
      encryptedUserPass,
    })
    .then(() => {
      req.flash("success", "Account succesfully created! ✅");
      res.redirect("/");
    })
    .catch(err => next(err))

});


// Login route and DB work :
// ------------------------------------

// route:
router.get("/login", (req, res, next) => {
  res.render('login-form.hbs')
});

// DB user work: 
router.post("/process-login", (req, res, next) => {
  const {
    userName,
    originalUserPass,
  } = req.body;

  User.findOne({
      userName: {
        $eq: userName
      }
    })
    .then(userDoc => {
      if (!userDoc) {
        req.flash("error", "Your user name doesn't match... ❌")
        res.redirect("/login");
        return;
      };

      const {
        encryptedUserPass
      } = userDoc;

      if (!bcrypt.compareSync(originalUserPass, encryptedUserPass)) {
        req.flash("error", "Invalid password ❌");
        res.redirect('/login');
        return;
      }
      req.flash("success", "You are logged in ✅");
      res.redirect("/");

    })
    .catch(err => next(err))
});



// Exports 
// ------------------------------------
module.exports = router;