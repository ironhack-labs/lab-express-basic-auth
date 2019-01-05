const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

// requires my User model
const User = require("../models/user");

router.get("/login", (req, res) => {
  res.render("login");
});

router.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  // find the user from db
  User.findOne({ username: username }).then(user => {
    if (!user) return;
    if (bcrypt.compareSync(password, user.password)) {
      // create a session ( meaning: a cookie with session ID )
      req.session.currentUser = user;
      res.redirect("/main");
    }
  });
});

router.get("/signup", (req, res) => {
  res.render("signup");
});

router.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  const salt = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(password, salt);

  const newUser = User({
    username,
    password: hashPass
  });

  if (username === "" || password === "") {
    res.render("signup", {
      errorMessage: "Indicate a username and a password to sign up"
    });
    return;
  }

  User.findOne({ username: username }).then(user => {
    if (user !== null) {
      res.render("signup", {
        errorMessage: "The username already exists!"
      });
      return;
    }

    const newUser = User({
      username,
      password: hashPass
    });

    newUser.save().then(() => {
      res.redirect("/login");
    });
  });
});

router.get("/logout", (req, res, next) => {
  req.session.destroy(err => {
    // cannot access session here
    res.redirect("/login");
  });
});

module.exports = router;
