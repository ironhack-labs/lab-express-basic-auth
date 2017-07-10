const express = require("express");
const router = express.Router();

const User = require("../models/user");
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

router.get("/", (req, res, next) => {
  res.render("signUp");
});

router.post("/", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username === "" || password === "") {
    res.render("signUp", {
      errorMessage: "You have to enter a username and a password!"
    });
    return;
  }

  User.findOne({ "username": username }, (error, user) => {
    if (user !== null) {
      res.render("signUp", {
        errorMessage: "The username already exists."
      });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = User({
      username,
      password: hashPass
    });

    newUser.save(error => {
      if (error) {
        res.render("signUp", {
          errorMessage: "Sorry, something failed!"
        });
      } else {
        res.redirect("/");
      }
    });
  });
});

module.exports = router;
