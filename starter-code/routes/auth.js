const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

const User = require("../models/User");

router.get("/signup", (req, res, next) => {
  res.render("signup");
});

router.get("/login", (req, res, next) => {
  res.render("login");
});

router.post("/login", (req, res, next) => {
  const { username, password } = req.body;
  User.findOne({ username })
    .then(found => {
      if (!found) {
        res.render("login", { message: "Invalid credentials" });
        return;
      }
      return bcrypt.compare(password, found.password).then(bool => {
        if (bool === false) {
          res.render("login", { message: "Invalid credentials" });
          return;
        }
        req.session.user = found;
        res.redirect("/");
      });
    })
    .catch(err => next(err));
});

router.post("/signup", (req, res, next) => {
  const { username, password } = req.body;
  if (!username) {
    return res.render("signup", { message: "Username can't be empty" });
  }
  if (password.length < 8) {
    return res.render("signup", { message: "Password is too short" });
  }
  User.findOne({ username })
    .then(found => {
      if (found) {
        return res.render("signup", {
          message: "Username is already taken, please choose another one."
        });
      }

      return bcrypt
        .genSalt()
        .then(salt => {
          return bcrypt.hash(password, salt);
        })
        .then(hash => {
          return User.create({ username: username, password: hash });
        })
        .then(newUser => {
          console.log(newUser);
          req.session.user = newUser;
          res.redirect("/");
        });
    })
    .catch(err => next(err));
});

router.get("/logout", (req, res, next) => {
  req.session.destroy(err => {
    if (err) {
      next(err);
    }
    res.redirect("/");
  });
});

module.exports = router;
