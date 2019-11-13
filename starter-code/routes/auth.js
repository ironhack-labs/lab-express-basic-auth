const express = require("express");
const Router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");

Router.get("/signup", (req, res) => {
  res.render("signup.hbs");
});

Router.post("/signup", (req, res, next) => {
  const { username, password } = req.body;

  if (!username) {
    res.render("signup.hbs", { message: "Username is required" });
    return;
  }
  if (password.length < 8) {
    res.render("signup.hbs", {
      message: "password needs to contain at least 8 characters"
    });
    return;
  }

  User.findOne({ username: username })
    .then(found => {
      if (found) {
        res.render("signup.hbs", { message: "username is already taken" });
        return;
      }
      bcrypt
        .genSalt()
        .then(salt => {
          return bcrypt.hash(password, salt);
        })
        .then(hash => {
          return User.create({ username: username, password: hash });
        })
        .then(newUser => {
          //req.session.user = newUser
          res.redirect("/");
        });
    })
    .catch(err => {
      next(err);
    });
});

Router.get("/login", (req, res) => {
  res.render("login.hbs");
});

Router.post("/login", (req, res, next) => {
  const { username, password } = req.body;
  User.findOne({ username: username })
    .then(found => {
      if (!found) {
        res.render("login.hbs", { message: "Invalid credentials" });
        return;
      }
      bcrypt.compare(password, found.password).then(bool => {
        if (bool === false) {
          res.render("login.hbs", { message: "Invalid credentials" });
          return;
        }
        req.session.user = found;
        res.redirect("/");
      });
    })
    .catch(err => {
      next(err);
    });
});

Router.get("/logout", (req, res, next) => {
  req.session.destroy(err => {
    if (err) next(err);
    else res.redirect("/");
  });
});

module.exports = Router;
