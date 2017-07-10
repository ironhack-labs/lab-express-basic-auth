const express = require("express");
const router = express.Router();

const User = require("../models/user");
const bcrypt = require("bcrypt");

router.get("/", (req, res, next) => {
  res.render("index");
});

router.post("/", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username === "" || password === "") {
    res.render("index", {
      errorMessage: "You have to enter a username and a password."
    });
    return;
  }

  User.findOne({ "username": username }, (error, user) => {
    if (error || !user) {
      res.render("index", {
        errorMessage: "Sorry, something failed!"
      });
      return;
    }

    if (bcrypt.compareSync(password, user.password)) {
      req.session.currentUser = user;
      res.redirect("/main");
    } else {
      res.render("index", {
        errorMessage: "You shall not pass!!!"
      });
    }
  });
});

module.exports = router;
