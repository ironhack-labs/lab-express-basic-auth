const express = require("express");
const bcrypt = require("bcrypt");

const router = express.Router();
const User = require("../models/User");

router.get("/signup", (req, res) => {
  res.render("signup");
});

router.get("/login", (req, res) => {
  res.render("login");
});

router.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username === "") {
    res.render("signup", { message: "Your username cannot be empty" });
    return;
  }

  User.findOne({ username: username }).then(found => {
    if (found !== null) {
      res.render("signup", { message: "This username is already taken" });
    } else {
      // create a user 
      const salt = bcrypt.genSaltSync();
      const hash = bcrypt.hashSync(password, salt);

      User.create({ username: username, password: hash })
        .then(dbUser => {
          res.redirect("/main");
        })
        .catch(err => {
          next(err);
        });
    }
  });
});

router.post("/login", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({ username: username }).then(found => {
    if (found === null) {
      // no username
      res.render("login", { message: "Invalid credentials" });
      return;
    }
    if (bcrypt.compareSync(password, found.password)) {
      // password and hash match
      req.session.currentUser = found;
      // console.log(req.session.currentUser, found)
      res.redirect("/main");
    } else {
      res.render("login", { message: "Invalid credentials" });
    }
  });
});

module.exports = router;
