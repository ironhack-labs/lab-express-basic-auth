const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

router.get("/signup", (res, req, next) => {
  res.render("signup.hbs");
});

router.post("/signup", (res, req, next) => {
  const { username, password } = req.body;

  // FIRST STEP. ARE FIELDS EMPTY?
  // IF YES, IT STOPPED IN THE IF STATEMENT
  if (!username || !password) {
    res.render("signup.hbs", { errorMessage: "Fields can not be empthy!" });
    return;
  }

  // SECOND STEP: CHECK IF THERES ANY USER WITH THAT USERNAME
  User.findOne({ username: username })
    .then(user => {
      // user HERE IS THE RESPONSE. IT CAN EITHER BE A TRUTHY VALUE OR A NULL VALUE
      // IF IT EXISTS (NOT NULL) IT ENTERS  THE IF STATEMENT
      if (user) {
        res.render("signup.hbs", { errorMessage: "Username already taken!" });
        return;
      }

      // IF user IS NULL; WE KEEP GOING

      return bcrypt.hash(password, 10); // ???
      // CREATE A HASHED PASSWORD
    })
    .then(hash => {
      // NOW THAT WE HAVE A HASHED PASSWORDÖ WE CREATE A NEW USERç
      return User.create({ username: username, password: hash });
    })
    .then(createdUser => {
      // FINALLY WE MAKE THE USER CONNECTED TO THE SESSION SO WE CAN STORE COOKIES; IF WE WANT
      req.session.user = createdUser; // session.user ????

      // REDIRECT TO THE MAIN PAGE.
      res.redirect("/");
    })
    .catch(err => next(err));
});

router.get("/login", (res, req) => {
  res.render("login.hbs");
});

router.post("/login", (res, req, next) => {
  const { username, password } = req.body;
  let user;

  // User.findOne({ username: req.body.username })
  User.findOne({ username: req.body.username })
    .then(foundUser => {
      if (!foundUser) {
        res.render("signup.hbs", { errorMessage: "Invalid credentials." });
        return;
      }
      user = foundUser;
      return bcrypt.compare(password, foundUser.password);
    })
    .then(match => {
      if (!match) {
        res.render("signup.hbs", { errorMessage: "invalid credentials" });
        return;
      }

      req.session.user = user;
      res.redirect("/");
    })
    .catch(err => next(err));
});

module.exports = router;
