const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const User = require("../models/User");
const private = require("../utils");

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

router.get("/signup", (req, res) => {
  res.render("signup.hbs");
});

router.post("/signup", (req, res, next) => {
  const { username, password } = req.body;
  if (!username) {
    res.render("signup.hbs", { message: "Username can't be empty" });
    return;
  }
  if (password.length < 8) {
    res.render("signup.hbs", { message: "Password is too short" });
    return;
  }
  User.findOne({ username: username }).then(found => {
    if (found) {
      res.render("signup.hbs", { message: "Username already in use" });
      return;
    }
  });
  return bcrypt
    .genSalt()
    .then(salt => {
      return bcrypt.hash(password, salt);
    })
    .then(hash => {
      return User.create({ username: username, password: hash });
    })
    .then(newUser => {
      req.session.user = newUser;
      res.redirect("/");
    })
    .catch(err => {
      next(err);
    });
});

router.get("/login", (req, res) => {
  res.render("login.hbs");
});

router.post("/login", (req, res, next) => {
  const { username, password } = req.body;
  User.findOne({ username: username }).then(found => {
    if (!found) {
      res.render("login.hbs", { message: "Invalid username/password!" });
      return;
    }
    return bcrypt.compare(password, found.password).then(pass => {
      if (!pass) {
        res.render("login.hbs", { message: "Invalid username/password!" });
        return;
      }
      req.session.user = found;
      res.render("index.hbs", { message: `You are logged in as ${username}` });
    });
  });
});

router.get("/logout", (req, res) => {
  req.session.destroy(err => {
    if (err) next(err);
    else res.render("index.hbs", { message: "You are logged out." });
  });
});

router.get("/main", private(), (req, res) => {
  res.render("main.hbs");
});

router.get("/private", private(), (req, res) => {
  res.render("private.hbs");
});

module.exports = router;
