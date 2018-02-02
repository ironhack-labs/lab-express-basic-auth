const express = require("express");
const router = express.Router();
const User = require("../models/auth");
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

/* GET users listing. */
router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

router.post("/signup", (req, res, next) => {
  var username = req.body.username;
  var password = req.body.password;

  bcrypt.genSalt(bcryptSalt, function(err, salt) {
    bcrypt.hash(password, salt, function(err, hash) {
      if (err) {
        return next(err);
      }
      var newUser = new User({
        username,
        password: hash
      });
      newUser.save(err => {
        if (err) return next(err);
        res.redirect("/");
      });
    });
  });
});

router.get("/login", (req, res, next) => {
  res.render("auth/login");
});

router.post("/login", (req, res, next) => {
  var username = req.body.username;
  var password = req.body.password;

  if (username === "" || password === "") {
    res.render("auth/login", {
      errorMessage: "Indicate a username and a password to sign up"
    });
    return;
  }

  User.findOne({ username: username }, (err, user) => {
    if (err || !user) {
      res.render("auth/login", {
        errorMessage: "The username doesn't exist"
      });
      return;
    }
    if (bcrypt.compareSync(password, user.password)) {
      // Save the login in the session!
      req.session.currentUser = user;
      res.redirect("/");
    } else {
      res.render("auth/login", {
        errorMessage: "Incorrect password"
      });
    }
  });
});

router.get("/main", (req, res, next) => {
  res.render("auth/login");
});

router.get("/private", (req, res, next) => {
  res.render("auth/login");
});

module.exports = router;
